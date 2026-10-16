import type { CSSProperties } from "react";
import type { PortfolioContent } from "@/lib/portfolio-content";
import { foundedProjects, foundersFirst, thesisFacts } from "@/lib/editorial/ventures";
import type { EditorialCopy } from "./copy";
import { MetricsTicker } from "./MetricsTicker";
import { QueryCard } from "./QueryCard";
import { SignalField } from "./SignalField";
import { VinylBadge } from "./VinylBadge";

interface HeroProps {
  copy: EditorialCopy;
  content: PortfolioContent;
}

const delay = (ms: number) => ({ ["--d" as string]: `${ms}ms` }) as CSSProperties;

/** Each word rises out of its own mask; `offset` continues the stagger across spans. */
function RisingWords({ text, offset = 0 }: { text: string; offset?: number }) {
  const words = text.split(" ");
  return words.map((word, i) => (
    <span key={`${i}-${word}`}>
      <span className="rise-mask">
        <span className="rise-word" style={{ ["--i" as string]: offset + i } as CSSProperties}>
          {word}
        </span>
      </span>
      {i < words.length - 1 ? " " : null}
    </span>
  ));
}

export function Hero({ copy, content }: HeroProps) {
  const status = content.contact.availability.split(" · ")[0];
  const founded = foundedProjects(content.projects).map((p) => p.title);
  const leadWords = copy.hero.lead.split(" ").length;
  const thesis = copy.hero.thesis(thesisFacts(content));

  // One grid, three blocks: on phones the card follows the headline (the
  // facts come before the pitch); from lg the card sits beside both.
  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col pt-16">
      <SignalField className="[mask-image:radial-gradient(ellipse_95%_85%_at_50%_62%,black_45%,transparent_100%)]" />

      <div className="relative mx-auto grid w-full max-w-[90rem] flex-1 content-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_21.5rem] lg:grid-rows-[1fr_1fr] lg:content-stretch lg:gap-x-14 lg:gap-y-10 lg:px-10 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <h1 className="min-w-0 font-display font-normal leading-[0.98] tracking-[-0.025em] text-[clamp(2.6rem,5.6vw,5.9rem)] text-pretty lg:col-start-1 lg:row-start-1 lg:self-end">
          <RisingWords text={copy.hero.lead} />{" "}
          <span className="italic font-light text-[hsl(var(--muted-foreground))]">
            <RisingWords text={copy.hero.rest(founded)} offset={leadWords} />
          </span>
        </h1>

        <QueryCard copy={copy} content={content} className="lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center" />

        <div className="flex min-w-0 flex-col gap-8 sm:flex-row sm:items-end sm:justify-between lg:col-start-1 lg:row-start-2 lg:self-start">
          <p className="enter max-w-[36rem] font-ui text-[1.0625rem] leading-relaxed text-[hsl(var(--muted-foreground))] sm:text-lg" style={delay(620)}>
            {thesis.map((segment, i) =>
              segment.strong ? (
                <strong key={i} className="font-medium text-[hsl(var(--foreground))]">
                  {segment.text}
                </strong>
              ) : (
                <span key={i}>{segment.text}</span>
              ),
            )}
          </p>
          <div className="enter self-end sm:self-auto" style={delay(780)}>
            <VinylBadge
              href="#contact"
              ring={`${copy.hero.badge} · ${status}`}
              label={copy.hero.badgeLabel}
              cursorLabel={copy.cursor.contact}
            />
          </div>
        </div>
      </div>

      <MetricsTicker projects={foundersFirst(content.projects)} />
    </section>
  );
}
