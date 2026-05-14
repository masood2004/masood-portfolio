import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import LichessMatches from "../../../components/LichessMatches";
import { projects } from "../../../data/projects";
import { absoluteUrl, canonicalPath, personName } from "../../seo";

type ProjectPageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  // Pre-render every known project detail page so crawlers receive fast,
  // complete HTML for each portfolio case study.
  return projects.map((project) => ({ id: project.id }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return {};
  }

  const path = canonicalPath(`/projects/${project.id}`);
  const title = `${project.title} Case Study`;
  const description = `${project.description} Built with ${project.techStack.join(", ")}.`;

  return {
    title,
    description,
    keywords: [project.title, ...project.techStack, `${project.title} ${personName}`],
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: "article",
      url: path,
      title,
      description,
      tags: project.techStack,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);

  if (!project) {
    notFound();
  }

  const projectJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    headline: `${project.title} by ${personName}`,
    description: project.description,
    url: absoluteUrl(`/projects/${project.id}`),
    author: {
      "@type": "Person",
      name: personName,
      url: absoluteUrl("/"),
    },
    keywords: project.techStack.join(", "),
    programmingLanguage: project.techStack,
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-300 p-8 font-mono selection:bg-neutral-700">
      {/* Project-level JSON-LD differentiates each case study and helps search
          engines understand the technologies, author, and canonical URL. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd) }}
      />

      <div className="max-w-3xl mx-auto mt-24">
        <Link
          href="/"
          className="text-neutral-500 hover:text-white transition-colors uppercase text-sm tracking-widest mb-12 block"
        >
          ← Return to Base
        </Link>

        <header className="mb-16">
          <p className="text-sm uppercase tracking-widest text-neutral-500 mb-3">
            {personName} Project Case Study
          </p>
          <h1 className="text-4xl text-white font-bold mb-6 tracking-tighter">
            {project.title}
          </h1>
          <p className="text-base leading-7 text-neutral-400 mb-8">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-3" aria-label="Technology stack">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="text-xs font-medium bg-neutral-900 text-neutral-400 px-3 py-1.5 rounded border border-neutral-800 uppercase tracking-wider"
              >
                {tech}
              </span>
            ))}
          </div>
        </header>

        <article className="border-t border-neutral-800 pt-12">
          <h2 className="text-xl text-white mb-6 uppercase tracking-widest">
            System Overview
          </h2>
          <p className="text-lg leading-relaxed text-neutral-400 mb-12">
            {project.description}
          </p>

          <h2 className="text-xl text-white mb-6 uppercase tracking-widest">
            Architecture & Implementation
          </h2>
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-sm text-neutral-500 text-sm leading-7 mb-12">
            {project.architecture}
          </div>

          {id === "fe64" && (
            <section className="border-t border-neutral-800 pt-12">
              <h2 className="text-xl text-white mb-6 uppercase tracking-widest">
                Live Execution
              </h2>
              <LichessMatches />
            </section>
          )}
        </article>
      </div>
    </main>
  );
}
