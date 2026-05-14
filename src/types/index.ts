export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  // Optional long-form implementation notes power richer project pages and
  // give crawlers more specific, non-duplicative technical content to index.
  architecture?: string;
  githubUrl?: string;
  liveUrl?: string;
}
