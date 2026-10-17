import { ArrowUpRight } from "lucide-react";
import type { PortfolioContent } from "@/lib/portfolio-content";
import type { EditorialCopy } from "./copy";
import { ContactEdge } from "./ContactEdge";
import { RisingWords } from "./Hero";
import { CopyButton, ResultFooter, SectionEyebrow } from "./primitives";

interface ContactBlockProps {
  contact: PortfolioContent["contact"];
  copy: EditorialCopy;
}

const KEY = "rounded border border-[hsl(var(--primary-foreground)/0.4)] px-1.5 py-0.5 font-mono text-[11px]";

const firstSentence = (text: string) => text.match(/^[^.!?]+[.!?]/)?.[0] ?? text;

/** Full-bleed accent close. Channel values are plain, selectable text. */
export function ContactBlock({ contact, copy }: ContactBlockProps) {
  const status = contact.availability.split(" · ")[0];
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="on-primary relative scroll-mt-16 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
    >
      <ContactEdge />
      <div className="relative mx-auto flex min-h-[88svh] max-w-[90rem] flex-col px-4 pb-10 pt-24 sm:px-6 sm:pt-28 lg:px-10">
        <SectionEyebrow
          tone="accent"
          label={copy.contact.eyebrow}
          meta={`(${copy.hero.facts.status}) ${status}`}
        />

        <h2
          id="contact-title"
          className="rise-view mt-12 max-w-[14ch] font-display text-[clamp(2.9rem,7.4vw,7.75rem)] font-normal leading-[0.94] tracking-[-0.03em] text-balance"
        >
          <RisingWords text={`${contact.subtitle}.`} />
        </h2>
        {/* The close mirrors the opening query: decorative, fades in with the headline. */}
        <p aria-hidden className="rise-view mt-8 font-mono text-[12px] tracking-[0.04em] text-[hsl(var(--primary-foreground)/0.7)]">
          <span className="fade-view inline-block">
            INSERT INTO conversaciones (de, para) VALUES (&apos;tú&apos;, &apos;santiago&apos;);
          </span>
        </p>
        <p className="mt-6 max-w-[34rem] font-ui text-lg leading-relaxed text-[hsl(var(--primary-foreground)/0.82)]">
          {firstSentence(contact.description)}
        </p>

        <ul className="mt-auto border-t border-[hsl(var(--primary-foreground)/0.25)] pt-2">
          {contact.channels.map((channel) => (
            <li
              key={channel.type}
              className="grid items-center gap-x-6 gap-y-3 border-b border-[hsl(var(--primary-foreground)/0.25)] py-5 md:grid-cols-[9rem_minmax(0,1fr)_auto]"
            >
              <span className="font-mono text-[12px] tracking-[0.06em] text-[hsl(var(--primary-foreground)/0.82)]">
                <span className="font-semibold">GET</span> /{channel.type}
              </span>
              <span className="select-all break-words font-display text-[clamp(1.5rem,3.4vw,2.9rem)] leading-[1.05] tracking-[-0.02em]">
                {channel.value}
              </span>
              <span className="flex flex-wrap gap-2">
                {channel.type === "email" && <CopyButton text={channel.value} labels={copy.clipboard} tone="accent" />}
                <a
                  href={channel.url}
                  target={channel.type === "email" ? undefined : "_blank"}
                  rel={channel.type === "email" ? undefined : "noopener noreferrer"}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[hsl(var(--primary-foreground))] px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-[hsl(var(--primary))] transition-opacity hover:opacity-85"
                >
                  {channel.type === "email" ? copy.contact.write : copy.contact.open}
                  <ArrowUpRight aria-hidden className="size-3.5" />
                </a>
              </span>
            </li>
          ))}
        </ul>
        <div className="pt-3">
          <ResultFooter tone="accent" text={copy.resultRows(contact.channels.length)} />
        </div>

        {/* Right padding keeps the fixed ⌘K button from covering the hint. */}
        <footer className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-3 pb-14 font-mono text-[11px] uppercase tracking-[0.16em] text-[hsl(var(--primary-foreground)/0.82)] sm:pb-0 sm:pr-60">
          <span>Santiago Fernández · {contact.location}</span>
          <span className="normal-case tracking-normal">
            {copy.contact.closing}{" "}
            {/* Keyboards get the shortcut; touch screens get the button's own label. */}
            <span className="[@media(hover:none)]:hidden">
              {copy.contact.press} <kbd className={KEY}>⌘K</kbd>
            </span>
            <span className="hidden [@media(hover:none)]:inline">
              {copy.contact.tap} <kbd className={KEY}>psql</kbd>
            </span>{" "}
            {copy.contact.closingEnd}
          </span>
        </footer>
      </div>
    </section>
  );
}
