import type { MetadataRoute } from "next";
import { projects } from "../data/projects";
import { absoluteUrl } from "./seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const projectRoutes = projects.map((project) => ({
    url: absoluteUrl(`/projects/${project.id}`),
    // Project pages are evergreen portfolio assets; weekly recrawls balance
    // discoverability with crawl-budget friendliness.
    changeFrequency: "weekly" as const,
    lastModified: new Date(),
    priority: 0.8,
  }));

  return [
    {
      url: absoluteUrl("/"),
      // The homepage is the highest-value landing page for branded searches.
      changeFrequency: "weekly",
      lastModified: new Date(),
      priority: 1,
    },
    ...projectRoutes,
  ];
}
