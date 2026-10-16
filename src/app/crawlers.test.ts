import { describe, expect, it } from "vitest";
import { SITE_URL } from "@/lib/site";
import robots from "./robots";
import sitemap from "./sitemap";

describe("robots.txt and sitemap", () => {
  it("send crawlers to the canonical site", () => {
    expect(robots().sitemap).toBe(`${SITE_URL}/sitemap.xml`);
    expect(sitemap().map((entry) => entry.url)).toEqual([SITE_URL]);
  });
});
