import { env } from "@/lib/env";

const LINKEDIN_URL = "https://www.linkedin.com/in/alloteyphilip/";

const BASE_URL = env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function StructuredData() {
  const sameAs: string[] = [];
  if (env.GITHUB_USERNAME) {
    sameAs.push(`https://github.com/${env.GITHUB_USERNAME}`);
  }
  sameAs.push(LINKEDIN_URL);

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${BASE_URL}/#person`,
        name: "Philip Allotey",
        url: BASE_URL,
        jobTitle: "Full-stack developer",
        image: `${BASE_URL}/opengraph-image`,
        sameAs,
      },
      {
        "@type": "WebSite",
        "@id": `${BASE_URL}/#website`,
        name: "Philip | Portfolio",
        url: BASE_URL,
        inLanguage: "en",
        publisher: { "@id": `${BASE_URL}/#person` },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
