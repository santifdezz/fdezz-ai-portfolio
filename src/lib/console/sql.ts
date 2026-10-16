import type { Cell, Column, Database, Table } from "./tables";

/**
 * A small slice of Postgres for the ⌘K console: psql meta-commands and
 *   SELECT * | count(*) | col, … FROM table
 *     [WHERE cond [AND cond …]] [ORDER BY col [ASC|DESC]] [LIMIT n] [;]
 * where cond is `col op value`, `col [NOT] LIKE|ILIKE 'pattern'`,
 * `col IS [NOT] NULL` or `'value' = ANY(col)`. Pure: input in, result out.
 */

export type ExpandedMode = "on" | "off" | "auto";

export type ConsoleError =
  | { code: "syntax"; near: string | null }
  | { code: "relation"; name: string }
  | { code: "column"; name: string }
  | { code: "meta"; command: string };

export type ConsoleResult =
  | { kind: "rows"; columns: readonly Column[]; rows: readonly (readonly Cell[])[]; title?: string }
  | { kind: "error"; error: ConsoleError; hint?: Hint }
  | { kind: "help" }
  | { kind: "expanded"; mode: ExpandedMode }
  | { kind: "quit" }
  | { kind: "empty" };

/** A next step to offer under an error: a query to run, or a pointer to `\d`. */
export type Hint = { kind: "query"; query: string } | { kind: "tables" } | { kind: "describe"; table: string };

type Token = { type: "word" | "string" | "number" | "symbol"; value: string };

const SYMBOLS = ["<=", ">=", "!=", "<>", "=", "<", ">", "*", ",", "(", ")", ";"];

class ParseError extends Error {
  constructor(readonly near: string | null) {
    super("syntax");
  }
}

export function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < input.length) {
    const rest = input.slice(i);
    const space = rest.match(/^\s+/);
    if (space) {
      i += space[0].length;
      continue;
    }
    if (rest[0] === "'") {
      let value = "";
      let j = 1;
      for (; j < rest.length; j++) {
        if (rest[j] === "'" && rest[j + 1] === "'") {
          value += "'";
          j++;
        } else if (rest[j] === "'") break;
        else value += rest[j];
      }
      if (j >= rest.length) throw new ParseError(rest);
      tokens.push({ type: "string", value });
      i += j + 1;
      continue;
    }
    if (rest[0] === '"') {
      const end = rest.indexOf('"', 1);
      if (end < 0) throw new ParseError(rest);
      tokens.push({ type: "word", value: rest.slice(1, end) });
      i += end + 1;
      continue;
    }
    const number = rest.match(/^\d+/);
    if (number) {
      tokens.push({ type: "number", value: number[0] });
      i += number[0].length;
      continue;
    }
    const word = rest.match(/^[\p{L}_][\p{L}\p{N}_]*/u);
    if (word) {
      tokens.push({ type: "word", value: word[0] });
      i += word[0].length;
      continue;
    }
    const symbol = SYMBOLS.find((s) => rest.startsWith(s));
    if (!symbol) throw new ParseError(rest[0]);
    tokens.push({ type: "symbol", value: symbol });
    i += symbol.length;
  }
  return tokens;
}

type Value = string | number | boolean | null;
type Condition =
  | { kind: "compare"; column: string; op: string; value: Value }
  | { kind: "like"; column: string; pattern: string; insensitive: boolean; negated: boolean }
  | { kind: "null"; column: string; negated: boolean }
  | { kind: "any"; column: string; value: Value };

interface Select {
  projection: "*" | "count" | string[];
  table: string;
  where: Condition[];
  orderBy: { column: string; desc: boolean } | null;
  limit: number | null;
}

class Parser {
  private i = 0;
  constructor(private readonly tokens: Token[]) {}

  private peek(): Token | undefined {
    return this.tokens[this.i];
  }
  private next(): Token {
    const token = this.tokens[this.i++];
    if (!token) throw new ParseError(null);
    return token;
  }
  private fail(): never {
    throw new ParseError(this.peek()?.value ?? null);
  }
  private isKeyword(word: string, token = this.peek()): boolean {
    return token?.type === "word" && token.value.toUpperCase() === word;
  }
  private keyword(word: string) {
    if (!this.isKeyword(word)) this.fail();
    this.i++;
  }
  private symbol(value: string) {
    const token = this.peek();
    if (token?.type !== "symbol" || token.value !== value) this.fail();
    this.i++;
  }
  private identifier(): string {
    const token = this.peek();
    if (token?.type !== "word") this.fail();
    this.i++;
    return token.value.toLowerCase();
  }
  private value(): Value {
    const token = this.next();
    if (token.type === "string") return token.value;
    if (token.type === "number") return Number(token.value);
    if (this.isKeyword("TRUE", token)) return true;
    if (this.isKeyword("FALSE", token)) return false;
    if (this.isKeyword("NULL", token)) return null;
    this.i--;
    return this.fail();
  }

  private condition(): Condition {
    if (this.peek()?.type === "string" || this.peek()?.type === "number") {
      const value = this.value();
      this.symbol("=");
      this.keyword("ANY");
      this.symbol("(");
      const column = this.identifier();
      this.symbol(")");
      return { kind: "any", column, value };
    }
    const column = this.identifier();
    if (this.isKeyword("IS")) {
      this.i++;
      const negated = this.isKeyword("NOT");
      if (negated) this.i++;
      this.keyword("NULL");
      return { kind: "null", column, negated };
    }
    const negated = this.isKeyword("NOT");
    if (negated) this.i++;
    if (this.isKeyword("LIKE") || this.isKeyword("ILIKE")) {
      const insensitive = this.isKeyword("ILIKE");
      this.i++;
      const pattern = this.next();
      if (pattern.type !== "string") {
        this.i--;
        this.fail();
      }
      return { kind: "like", column, pattern: pattern.value, insensitive, negated };
    }
    if (negated) this.fail();
    const op = this.peek();
    if (op?.type !== "symbol" || !["=", "!=", "<>", "<", ">", "<=", ">="].includes(op.value)) this.fail();
    this.i++;
    return { kind: "compare", column, op: op.value === "<>" ? "!=" : op.value, value: this.value() };
  }

  select(): Select {
    this.keyword("SELECT");
    let projection: Select["projection"];
    if (this.peek()?.value === "*") {
      this.i++;
      projection = "*";
    } else if (this.isKeyword("COUNT")) {
      this.i++;
      this.symbol("(");
      this.symbol("*");
      this.symbol(")");
      projection = "count";
    } else {
      const columns = [this.identifier()];
      while (this.peek()?.value === ",") {
        this.i++;
        columns.push(this.identifier());
      }
      projection = columns;
    }
    this.keyword("FROM");
    const table = this.identifier();
    const where: Condition[] = [];
    if (this.isKeyword("WHERE")) {
      this.i++;
      where.push(this.condition());
      while (this.isKeyword("AND")) {
        this.i++;
        where.push(this.condition());
      }
    }
    let orderBy: Select["orderBy"] = null;
    if (this.isKeyword("ORDER")) {
      this.i++;
      this.keyword("BY");
      const column = this.identifier();
      const desc = this.isKeyword("DESC");
      if (desc || this.isKeyword("ASC")) this.i++;
      orderBy = { column, desc };
    }
    let limit: number | null = null;
    if (this.isKeyword("LIMIT")) {
      this.i++;
      const n = this.next();
      if (n.type !== "number") {
        this.i--;
        this.fail();
      }
      limit = Number(n.value);
    }
    if (this.peek()?.value === ";") this.i++;
    if (this.peek()) this.fail();
    return { projection, table, where, orderBy, limit };
  }
}

const likeToRegExp = (pattern: string, insensitive: boolean) =>
  new RegExp(
    `^${Array.from(pattern, (ch) => (ch === "%" ? ".*" : ch === "_" ? "." : ch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))).join("")}$`,
    insensitive ? "is" : "s",
  );

function compare(a: Cell, b: Value): number {
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b));
}

function matches(cell: Cell, condition: Condition): boolean {
  switch (condition.kind) {
    case "null":
      return (cell === null) !== condition.negated;
    case "any":
      return Array.isArray(cell) && cell.some((item) => item === condition.value);
    case "like": {
      if (cell === null) return false;
      const regex = likeToRegExp(condition.pattern, condition.insensitive);
      const hit = Array.isArray(cell) ? cell.some((item) => regex.test(item)) : regex.test(String(cell));
      return hit !== condition.negated;
    }
    case "compare": {
      if (cell === null || condition.value === null || Array.isArray(cell)) return false;
      const order = typeof cell === "boolean" ? (cell === condition.value ? 0 : 1) : compare(cell, condition.value);
      switch (condition.op) {
        case "=":
          return order === 0;
        case "!=":
          return order !== 0;
        case "<":
          return order < 0;
        case ">":
          return order > 0;
        case "<=":
          return order <= 0;
        default:
          return order >= 0;
      }
    }
  }
}

function sortCells(a: Cell, b: Cell): number {
  if (a === null) return b === null ? 0 : 1;
  if (b === null) return -1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b));
}

function execute(select: Select, db: Database): ConsoleResult {
  const table = db.get(select.table);
  if (!table) return { kind: "error", error: { code: "relation", name: select.table }, hint: { kind: "tables" } };

  const index = (name: string) => table.columns.findIndex((c) => c.name === name);
  const referenced = [
    ...(Array.isArray(select.projection) ? select.projection : []),
    ...select.where.map((c) => c.column),
    ...(select.orderBy ? [select.orderBy.column] : []),
  ];
  const missing = referenced.find((name) => index(name) < 0);
  if (missing) return { kind: "error", error: { code: "column", name: missing }, hint: { kind: "describe", table: table.name } };

  let rows = table.rows.filter((row) => select.where.every((c) => matches(row[index(c.column)], c)));
  if (select.orderBy) {
    const { column, desc } = select.orderBy;
    const at = index(column);
    rows = [...rows].sort((a, b) => (desc ? -1 : 1) * sortCells(a[at], b[at]));
  }
  if (select.limit !== null) rows = rows.slice(0, select.limit);

  if (select.projection === "count") return { kind: "rows", columns: [{ name: "count", type: "int4" }], rows: [[rows.length]] };
  if (select.projection === "*") return { kind: "rows", columns: table.columns, rows };
  const picks = select.projection.map(index);
  return { kind: "rows", columns: picks.map((i) => table.columns[i]), rows: rows.map((row) => picks.map((i) => row[i])) };
}

/** `\d`: the relations, as psql lists them. */
function listRelations(db: Database): ConsoleResult {
  return {
    kind: "rows",
    title: "relations",
    columns: [
      { name: "Schema", type: "text" },
      { name: "Name", type: "text" },
      { name: "Type", type: "text" },
      { name: "Owner", type: "text" },
    ],
    rows: [...db.keys()].map((name) => ["public", name, "table", "santiago"]),
  };
}

/** `\d table`: its columns and types. */
function describe(table: Table): ConsoleResult {
  return {
    kind: "rows",
    title: `table:${table.name}`,
    columns: [
      { name: "Column", type: "text" },
      { name: "Type", type: "text" },
    ],
    rows: table.columns.map((c) => [c.name, c.type === "int4" ? "integer" : c.type === "bool" ? "boolean" : c.type]),
  };
}

function meta(input: string, db: Database): ConsoleResult {
  const [command, ...args] = input.split(/\s+/);
  switch (command) {
    case "\\?":
    case "\\h":
      return { kind: "help" };
    case "\\q":
      return { kind: "quit" };
    case "\\d":
    case "\\dt": {
      if (args.length === 0) return listRelations(db);
      const name = args[0].replace(/;$/, "").toLowerCase();
      const table = db.get(name);
      return table ? describe(table) : { kind: "error", error: { code: "relation", name }, hint: { kind: "tables" } };
    }
    case "\\x": {
      const mode = args[0]?.toLowerCase();
      if (mode === "on" || mode === "off" || mode === "auto") return { kind: "expanded", mode };
      return { kind: "expanded", mode: "on" };
    }
    default:
      return { kind: "error", error: { code: "meta", command }, hint: { kind: "query", query: "\\?" } };
  }
}

const SUGGESTIONS: ReadonlyArray<{ words: RegExp; query: string }> = [
  { words: /proyect|project|makineo|ufc|pipeline|portfolio/, query: "SELECT title, status, figure FROM projects;" },
  { words: /experien|trabaj|work|job|estudi|educa|stage|etapa|trayectoria|career|carrera|qaleon/, query: "SELECT start_year, title, institution FROM stages ORDER BY start_year DESC;" },
  { words: /skill|stack|tecnolog|technolog|lenguaj|language|python|habilidad|herramienta|tool/, query: "SELECT category, skill FROM skills;" },
  { words: /contact|email|correo|mail|linkedin|github|hablar|talk|hire|contratar/, query: "SELECT * FROM channels;" },
  { words: /quien|who|sobre|about|santi|tu |you|perfil|profile|cv/, query: "SELECT * FROM people;" },
];

/** For input that isn't SQL (a question, say), the query that answers it best. */
export function suggestQuery(input: string): string {
  const text = ` ${input.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "")} `;
  return SUGGESTIONS.find((s) => s.words.test(text))?.query ?? "\\d";
}

/** Run one line typed at the `santiago=#` prompt. */
export function run(input: string, db: Database): ConsoleResult {
  const line = input.trim();
  if (line === "" || line === ";") return { kind: "empty" };
  if (line.startsWith("\\")) return meta(line, db);
  if (/^(help|\?)$/i.test(line)) return { kind: "help" };
  if (/^(exit|quit)$/i.test(line)) return { kind: "quit" };

  // Not a query at all (often a question): say so the way psql would, and offer the query that answers it.
  if (!/^select\b/i.test(line)) {
    return { kind: "error", error: { code: "syntax", near: line.split(/\s+/)[0] }, hint: { kind: "query", query: suggestQuery(line) } };
  }
  try {
    return execute(new Parser(tokenize(line)).select(), db);
  } catch (error) {
    if (error instanceof ParseError) return { kind: "error", error: { code: "syntax", near: error.near } };
    throw error;
  }
}
