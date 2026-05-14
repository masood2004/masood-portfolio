import type { MetadataRoute } from "next";
import { absoluteUrl, siteUrl } from "./seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      // Allow reputable crawlers to index the public portfolio and its project
      // case studies while keeping the generated API endpoint out of results.
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: siteUrl.origin,
  };
}
