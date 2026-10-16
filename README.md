# sfseoane — Data Engineer Portfolio

A portfolio built with **Next.js 16**, **React 19**, **TypeScript**, and **Tailwind CSS v4**. An editorial landing page (serif display type, a signal-field hero, a pinned horizontal project gallery, a DAW-style timeline) presents Santiago from real data; behind **⌘K**, a `psql` session on the portfolio itself.

## Features

🗄️ **⌘K psql console** — Query the portfolio as a Postgres database: `\d`, `SELECT … FROM projects`, psql's own output formats
📈 **One motif, end to end** — The hero's ridgeline signal returns in every section rule, the project plates and the contact edge
🌍 **Bilingual** — English & Spanish, including psql's messages
♿ **Reduced motion** — Every animation has a still, resolved fallback
⚡ **Fast & Static** — No external APIs, 100% frontend
🐳 **Containerized** — Docker for consistent development
📱 **Responsive** — Works on desktop and mobile

## Quick Start

### With Docker (recommended)

```bash
# Development
make dev
# or: docker-compose up

# Production
make prod
# or: docker-compose -f docker-compose.prod.yml up -d

# Build production image
make build
```

Then open [http://localhost:3000](http://localhost:3000).

### Without Docker

```bash
npm install
npm run dev
```

## The ⌘K console

⌘K (or the `psql` button) opens a psql session whose tables — `people`,
`projects`, `stages`, `skills`, `channels` — are built from
`portfolio-content.ts`, so it can only say what the page says. It runs a
slice of SQL (`SELECT * | count(*) | cols FROM t [WHERE …] [ORDER BY …]
[LIMIT n]`, with `ILIKE`, `IS NULL` and `'v' = ANY(col)`) and the
meta-commands `\?`, `\d [table]`, `\x [on|off|auto]` and `\q`.

It is not an assistant: a plain question gets psql's syntax error plus a
clickable hint with the query that answers it. The engine is pure and tested
(`src/lib/console/`).

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Editorial landing + ⌘K command palette
│   ├── layout.tsx                  # Root layout, metadata, fonts
│   └── globals.css                 # Theme tokens, plate colours, motion
├── components/
│   ├── editorial/                  # Landing: hero, reveal, gallery, timeline, stack, contact
│   │   └── copy.ts                 # UI copy (ES/EN); all facts come from portfolio-content.ts
│   ├── CommandPalette.tsx          # ⌘K overlay and its trigger
│   └── console/PsqlConsole.tsx     # The psql session UI
└── lib/
    ├── editorial/                  # Pure, tested helpers (figures, ridges, timeline, scroll)
    ├── console/                    # psql engine: tables, SQL subset, output formats
    ├── seo/                        # JSON-LD, OG ridge field
    └── portfolio-content.ts        # Bilingual project/skill/contact data
```

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **Containerization:** Docker & Docker Compose
- **Fonts:** Newsreader (display), IBM Plex Sans (body), IBM Plex Mono (labels, data)
- **Tests:** Vitest (`npm test`)

## Development

### With Make

```bash
make dev              # Start dev server
make dev-build       # Rebuild dev container
make lint            # Run ESLint
make type-check      # Run TypeScript check
make logs            # View logs
make clean           # Remove containers & volumes
```

### With docker-compose

```bash
docker-compose up              # Start dev
docker-compose down            # Stop
docker-compose logs -f web     # Logs
docker-compose exec web npm run lint
```

## Customization

### Change developer name / bio / contact

1. Update `src/app/layout.tsx` — page metadata (title, OG, JSON-LD)
2. Update `src/components/editorial/copy.ts` — headline, thesis and section copy
   (a test fails if the thesis quotes a number that isn't in the content)
3. Update `src/lib/portfolio-content.ts` — bio, projects, skills, contact
   links (separate `contentEN`/`contentES` objects — keep both in sync)

### Add new projects

Edit `src/lib/portfolio-content.ts` and add an entry to the `projects`
array **in both `contentEN` and `contentES`**:

```typescript
{
  id: "my-project",
  title: "My Project",
  description: "Short description",
  status: "completed", // or "in-progress"
  statusColor: "green", // or "yellow"
  technologies: ["Tech1", "Tech2"],
  features: ["Feature one", "Feature two"],
  links: {
    github: "https://github.com/your-handle/my-project",
  },
  role: "founder", // optional: names it in the headline, badges it, opens the gallery
}
```

On the landing gallery, the giant number on each project's coloured plate is
lifted from that project's own `features`/`description` (the largest figure,
e.g. `200+` → "events managed"). To pick its plate colour, add
the `id` to `PLATE_BY_PROJECT` in `src/components/editorial/ProjectSlide.tsx`;
unknown ids rotate through the palette.

### Change colors

Edit `src/app/globals.css` — CSS variables at `:root`.

## Deployment

### Production Docker Image

```bash
docker-compose -f docker-compose.prod.yml up -d
# or: make prod
```

### To a VPS

```bash
# Build the image
make build

# Push to registry (e.g., Docker Hub)
docker tag fdezz-ai-portfolio:latest your-registry/fdezz:latest
docker push your-registry/fdezz:latest

# On server
docker pull your-registry/fdezz:latest
docker-compose -f docker-compose.prod.yml up -d
```

## Troubleshooting

### Container won't start
```bash
make clean
make dev-build
```

### Port 3000 already in use
```bash
docker-compose down
# Change port in docker-compose.yml and try again
```

### Changes not showing
```bash
docker-compose down
docker volume prune
make dev
```

## License

MIT — Use freely for your portfolio.

---

**Built with ❤️ using Next.js 16, React 19, and TypeScript 5.**

Made by **Santiago Fernández** — [GitHub](https://github.com/santifdezz) • [Email](mailto:santifdezseo@gmail.com)
