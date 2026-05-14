import { projects } from "../data/projects";

// Keep canonical SEO settings in one server-only module so page metadata,
// JSON-LD, robots.txt, and sitemap.xml never drift out of sync.
export const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://masood-portfolio.vercel.app",
);

export const personName = "Syed Masood Hussain";
export const professionalTitle = "Systems Engineer";
export const siteName = `${personName} Portfolio`;
export const siteDescription =
  "Systems engineering portfolio for Syed Masood Hussain, featuring infrastructure, computer vision, compiler, chess engine, and data integrity projects.";
export const profileEmail = "mailto:hmasood3288@gmail.com";
export const githubProfile = "https://github.com/masood2004";
export const linkedinProfile = "https://www.linkedin.com/in/masood-h/";

export const seoKeywords = [
  personName,
  "Syed Masood Hussain systems engineer",
  "systems engineer portfolio",
  "infrastructure engineer",
  "computer vision engineer",
  "LLM infrastructure",
  "compiler engineering",
  "chess engine developer",
  "MySQL data integrity",
  ...projects.map((project) => project.title),
];

export function absoluteUrl(path = "/") {
  // URL() normalizes slashes, making canonical links safe even when callers
  // pass either `/projects/fe64` or `projects/fe64`.
  return new URL(path, siteUrl).toString();
}

export function canonicalPath(path = "/") {
  // Search engines treat trailing-slash variants as separate URLs, so every
  // metadata producer uses the same canonical path shape.
  return path === "/" ? "/" : path.replace(/\/$/, "");
}
