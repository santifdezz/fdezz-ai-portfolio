import { ImageResponse } from "next/og";
import { foundedProjects } from "@/lib/editorial/ventures";
import { parseYearRange } from "@/lib/editorial/timeline";
import { getPortfolioContent } from "@/lib/portfolio-content";
import { buildRidgeField, ridgeGlow } from "@/lib/seo/og-ridges";
import { SITE_URL } from "@/lib/site";

// Statically renderable: no cookies/headers/searchParams, just content + a font fetch.
export const dynamic = "force-static";

const WIDTH = 1200;
const HEIGHT = 630;

const BG = "#080808";
const FG = "#f0f0f0";
const CARD = "#111111";
const BORDER = "#262626"; // hsl(0 0% 15%)
const MUTED = "#9ca3af";
const VIOLET = "#a366ff";
const LIME = "#c8ff00";

// The site's own name constant (src/lib/seo/person-schema.ts): portfolio-content has no field
// for it, so it is fixed here the same way, not invented.
const NAME = "Santiago Fernández.";

interface LoadedFont {
  name: string;
  data: ArrayBuffer;
  weight: 300 | 400 | 500;
  style: "normal" | "italic";
}

/**
 * Fetches a Google Font as TTF the way Vercel's og-image examples do: satori
 * can't read woff2, and Google only serves truetype to a request with no
 * modern User-Agent. `text` subsets the font to just the glyphs we render.
 * Returns null (never throws) so a network hiccup falls back to satori's
 * built-in default font instead of breaking the route.
 */
async function loadGoogleFont(options: {
  family: string;
  text: string;
  weight: 300 | 400 | 500;
  italic?: boolean;
}): Promise<LoadedFont | null> {
  const { family, text, weight, italic = false } = options;
  try {
    const cssUrl = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:ital,wght@${italic ? 1 : 0},${weight}&text=${encodeURIComponent(text)}`;
    const cssRes = await fetch(cssUrl);
    if (!cssRes.ok) return null;
    const css = await cssRes.text();
    const fontUrl = css.match(/src: url\(([^)]+)\) format\('(?:truetype|opentype)'\)/)?.[1];
    if (!fontUrl) return null;
    const fontRes = await fetch(fontUrl);
    if (!fontRes.ok) return null;
    const data = await fontRes.arrayBuffer();
    return { name: family, data, weight, style: italic ? "italic" : "normal" };
  } catch {
    return null;
  }
}

function buildScene() {
  const { about, contact, projects } = getPortfolioContent("es");
  const { education } = about;
  const current = education[education.length - 1];
  const first = parseYearRange(education[0]?.year ?? "");
  const last = parseYearRange(current?.year ?? "");
  const founded = foundedProjects(projects);
  const status = contact.availability.split(" · ")[0];
  const domain = new URL(SITE_URL).host;

  const tagline =
    founded.length > 0
      ? `Construyo sistemas de datos con IA y fundé ${founded.map((p) => p.title).join(" y ")}.`
      : "Construyo sistemas de datos con IA que procesan millones de registros.";

  const rows: Array<{ name: string; type: string; value: string }> = [
    { name: "role", type: "text", value: current?.title ?? "" },
    ...(founded.length > 0
      ? [{ name: "founded", type: "text[]", value: `{${founded.map((p) => p.title).join(", ")}}` }]
      : []),
    ...(first && last ? [{ name: "path", type: "int4range", value: `[${first.start}, ${last.end}]` }] : []),
    { name: "base", type: "text", value: contact.location },
    { name: "status", type: "text", value: status },
  ];

  return { rows, tagline, domain };
}

export async function GET() {
  const { rows, tagline, domain } = buildScene();

  const monoText = [
    "SELECT * FROM people",
    "WHERE id = 'santiago';",
    ...rows.map((r) => `${r.name} ${r.type}`),
    domain,
  ].join(" ");
  const sansText = rows.map((r) => r.value).join(" ");

  const [newsreader, newsreaderItalic, mono, sans] = await Promise.all([
    loadGoogleFont({ family: "Newsreader", text: NAME, weight: 500 }),
    loadGoogleFont({ family: "Newsreader", text: tagline, weight: 300, italic: true }),
    loadGoogleFont({ family: "IBM Plex Mono", text: monoText, weight: 400 }),
    loadGoogleFont({ family: "IBM Plex Sans", text: sansText, weight: 400 }),
  ]);
  const fonts = [newsreader, newsreaderItalic, mono, sans].filter((f): f is LoadedFont => f !== null);

  // Geometry matches SignalField's own hero canvas: ~20 ridges from 16% of the height down to
  // the bottom edge, one Gaussian peak placed behind/below the card's left edge.
  const RIDGE_TOP = Math.round(HEIGHT * 0.16);
  const RIDGE_BOTTOM = HEIGHT;
  const PEAK_X = Math.round(WIDTH * 0.62);
  const PEAK_Y = Math.round(HEIGHT * 0.55);
  // SignalField strokes each ridge with a horizontal gradient spanning peak.x ± 260.
  const GRADIENT_HALF = 260;
  // The field fades in from the left (an SVG mask) so it never fights the name for legibility.
  const LEFT_FADE = 480;

  const ridges = buildRidgeField({
    width: WIDTH,
    top: RIDGE_TOP,
    bottom: RIDGE_BOTTOM,
    lines: 20,
    peakX: PEAK_X,
    peakY: PEAK_Y,
    peakStrength: 1.15,
    step: 16,
  });

  const monoFont = mono ? "IBM Plex Mono" : undefined;
  const sansFont = sans ? "IBM Plex Sans" : undefined;
  const serifFont = newsreader ? "Newsreader" : undefined;
  const serifItalicFont = newsreaderItalic ? "Newsreader" : undefined;

  return new ImageResponse(
    (
      <div
        style={{
          width: WIDTH,
          height: HEIGHT,
          display: "flex",
          position: "relative",
          backgroundColor: BG,
          backgroundImage: "linear-gradient(135deg, #080808 0%, #0a120e 100%)",
        }}
      >
        <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ position: "absolute", top: 0, left: 0 }}>
          <defs>
            {/* Fades the whole field in from the left so it never fights the name for legibility. */}
            <linearGradient id="field-fade" gradientUnits="userSpaceOnUse" x1={0} y1={0} x2={LEFT_FADE} y2={0}>
              <stop offset="0%" stopColor="#000000" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>
            <mask id="field-mask" maskUnits="userSpaceOnUse" x={0} y={0} width={WIDTH} height={HEIGHT}>
              <rect x={0} y={0} width={WIDTH} height={HEIGHT} fill="url(#field-fade)" />
            </mask>
            {/* One horizontal gradient per ridge: quiet foreground at the edges, and — only for a
                ridge the peak actually lifts — violet in the middle. Same shape as SignalField's
                own canvas gradient (`createLinearGradient(peak.x - 260, 0, peak.x + 260, 0)`), so
                the peak glows smoothly instead of a hard-edged band. */}
            {ridges.map((ridge, i) => {
              const glow = ridgeGlow(ridge.lift);
              return (
                <linearGradient
                  key={`grad-${i}`}
                  id={`ridge-glow-${i}`}
                  gradientUnits="userSpaceOnUse"
                  x1={PEAK_X - GRADIENT_HALF}
                  y1={0}
                  x2={PEAK_X + GRADIENT_HALF}
                  y2={0}
                >
                  <stop offset="0%" stopColor={FG} stopOpacity={0.09} />
                  <stop offset="50%" stopColor={glow.color} stopOpacity={glow.opacity} />
                  <stop offset="100%" stopColor={FG} stopOpacity={0.09} />
                </linearGradient>
              );
            })}
          </defs>
          {/* Each ridge's own area fill (bg-coloured, closed to the bottom) is drawn immediately
              before its stroke, top ridge first, so every later ridge correctly occludes the
              ones above it — the same back-to-front order SignalField draws in. */}
          <g mask="url(#field-mask)">
            {ridges.flatMap((ridge, i) => [
              <path key={`area-${i}`} d={ridge.areaD} fill={BG} stroke="none" />,
              <path key={`line-${i}`} d={ridge.strokeD} fill="none" stroke={`url(#ridge-glow-${i})`} strokeWidth={1.6} />,
            ])}
          </g>
        </svg>

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            padding: "60px 64px",
          }}
        >
          <div style={{ display: "flex", flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 36 }}>
            <div style={{ display: "flex", flexDirection: "column", maxWidth: 600, gap: 22 }}>
              <div
                style={{
                  display: "flex",
                  fontFamily: serifFont,
                  fontWeight: 500,
                  fontSize: 68,
                  lineHeight: 1.04,
                  letterSpacing: -1.5,
                  color: FG,
                }}
              >
                {NAME}
              </div>
              <div
                style={{
                  display: "flex",
                  fontFamily: serifItalicFont,
                  fontStyle: "italic",
                  fontWeight: 300,
                  fontSize: 29,
                  lineHeight: 1.4,
                  color: MUTED,
                }}
              >
                {tagline}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: 436,
                borderRadius: 16,
                border: `1px solid ${BORDER}`,
                backgroundColor: CARD,
                boxShadow: `6px 6px 0 0 ${VIOLET}`,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "16px 20px",
                  borderBottom: `1px solid ${BORDER}`,
                  backgroundColor: "rgba(8, 8, 8, 0.55)",
                  fontFamily: monoFont,
                  fontSize: 14.5,
                  lineHeight: 1.6,
                  color: "rgba(240, 240, 240, 0.85)",
                }}
              >
                <div style={{ display: "flex" }}>
                  <span style={{ color: VIOLET }}>SELECT</span>&nbsp;*&nbsp;<span style={{ color: VIOLET }}>FROM</span>&nbsp;people
                </div>
                <div style={{ display: "flex" }}>
                  <span style={{ color: VIOLET }}>WHERE</span>&nbsp;id&nbsp;=&nbsp;<span style={{ color: LIME }}>&apos;santiago&apos;</span>;
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", padding: "6px 20px 10px" }}>
                {rows.map((row, i) => (
                  <div
                    key={row.name}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 14,
                      padding: "13px 0",
                      borderBottom: i < rows.length - 1 ? `1px dashed ${BORDER}` : "none",
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "column", width: 92, flexShrink: 0 }}>
                      <span style={{ display: "flex", fontFamily: monoFont, fontSize: 13, color: "rgba(240, 240, 240, 0.9)" }}>
                        {row.name}
                      </span>
                      <span style={{ display: "flex", fontFamily: monoFont, fontSize: 11, color: MUTED, marginTop: 2 }}>
                        {row.type}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flex: 1,
                        fontFamily: sansFont,
                        fontSize: 16,
                        lineHeight: 1.3,
                        color: FG,
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      {row.name === "status" && (
                        <span style={{ display: "flex", width: 9, height: 9, borderRadius: 9999, backgroundColor: VIOLET }} />
                      )}
                      <span style={{ display: "flex" }}>{row.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              borderTop: `1px solid ${BORDER}`,
              paddingTop: 20,
              fontFamily: monoFont,
              fontSize: 13,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: MUTED,
            }}
          >
            <span style={{ display: "flex" }}>{domain}</span>
          </div>
        </div>
      </div>
    ),
    { width: WIDTH, height: HEIGHT, fonts },
  );
}
