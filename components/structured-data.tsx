import { env, SITE_URL } from "@/lib/env";

const LINKEDIN_URL = "https://www.linkedin.com/in/alloteyphilip/";

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
        "@id": `${SITE_URL}/#person`,
        name: "Philip Allotey",
        url: SITE_URL,
        jobTitle: "Full-stack developer",
        image: `${SITE_URL}/opengraph-image`,
        sameAs
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: "Philip Allotey",
        url: SITE_URL,
        inLanguage: "en",
        publisher: { "@id": `${SITE_URL}/#person` }
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
