export function JsonSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://fdezz.ai/#person",
    name: "Santiago Fernández",
    url: "https://fdezz.ai",
    email: "contact@fdezz.ai",
    image: "https://fdezz.ai/og-image.png",
    sameAs: [
      "https://github.com/fdezz",
      "https://linkedin.com/in/sfdezz",
    ],
    jobTitle: "Data Engineer",
    workLocation: {
      "@type": "Place",
      name: "Madrid, Spain",
    },
    knowsLanguage: [
      {
        "@type": "Language",
        name: "Spanish",
      },
      {
        "@type": "Language",
        name: "English",
      },
    ],
    worksFor: {
      "@type": "Organization",
      name: "Qaleon",
      url: "https://qaleon.com",
    },
    hasSkill: [
      {
        "@type": "Thing",
        name: "Python",
      },
      {
        "@type": "Thing",
        name: "TypeScript",
      },
      {
        "@type": "Thing",
        name: "React",
      },
      {
        "@type": "Thing",
        name: "Big Data",
      },
      {
        "@type": "Thing",
        name: "Machine Learning",
      },
      {
        "@type": "Thing",
        name: "Cloud Architecture",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
