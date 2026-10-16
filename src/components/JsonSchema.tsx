import { getPortfolioContent } from "@/lib/portfolio-content";
import { buildPersonSchema, serializeJsonLd } from "@/lib/seo/person-schema";

export function JsonSchema() {
  const schema = buildPersonSchema(getPortfolioContent("en"));

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
    />
  );
}
