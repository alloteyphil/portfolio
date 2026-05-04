import type { MetadataRoute } from "next";
import { env } from "@/lib/env";

const BASE_URL = env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/"
    },
    sitemap: `${BASE_URL}/sitemap.xml`
  };
}
