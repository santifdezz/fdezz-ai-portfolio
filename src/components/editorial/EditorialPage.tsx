"use client";

import { MotionConfig } from "framer-motion";
import { getPortfolioContent } from "@/lib/portfolio-content";
import type { Locale } from "@/lib/portfolio-content";
import { COPY, ENTITY_TAGS } from "./copy";
import { ContactBlock } from "./ContactBlock";
import { CustomCursor } from "./CustomCursor";
import { EditorialNav } from "./EditorialNav";
import { useTransport } from "./hooks";
import { Intro } from "./Intro";
import { ExperienceTimeline } from "./ExperienceTimeline";
import { Hero } from "./Hero";
import { PointReveal } from "./PointReveal";
import { StackList } from "./StackList";
import { WorkGallery } from "./WorkGallery";

interface EditorialPageProps {
  locale: Locale;
  onLocaleChange: (l: Locale) => void;
}

// "I've built RAG systems with LangChain…" — the bio paragraph that states the work.
const POINT_PARAGRAPH = 2;

export function EditorialPage({ locale, onLocaleChange }: EditorialPageProps) {
  useTransport();
  const copy = COPY[locale];
  const content = getPortfolioContent(locale);
  const { bio, education } = content.about;
  const paragraphs = bio.shortDescription.split("\n\n");
  const point = paragraphs[POINT_PARAGRAPH] ?? paragraphs[paragraphs.length - 1];
  const groups = Object.entries(bio.skills).map(([name, terms]) => ({
    tag: ENTITY_TAGS[name] ?? name.split(/\s+/)[0].toUpperCase(),
    terms,
  }));

  return (
    <MotionConfig reducedMotion="user">
      <div className="editorial bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-[hsl(var(--primary))] focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:text-[hsl(var(--primary-foreground))]"
        >
          {copy.skip}
        </a>
        <Intro name="Santiago Fernández" role={copy.intro.role} />
        <EditorialNav copy={copy} locale={locale} onLocaleChange={onLocaleChange} />
        <main id="main">
          <Hero copy={copy} content={content} />
          <PointReveal eyebrow={copy.point.eyebrow} paragraph={point} groups={groups} entitiesLabel={copy.point.entities} />
          <WorkGallery projects={content.projects} copy={copy} />
          <ExperienceTimeline entries={education} copy={copy} />
          <StackList skills={bio.skills} copy={copy} />
          <ContactBlock contact={content.contact} copy={copy} />
        </main>
        <CustomCursor />
      </div>
    </MotionConfig>
  );
}
