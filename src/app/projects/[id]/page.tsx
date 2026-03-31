import { notFound } from "next/navigation";
import Link from "next/link";
import { projects } from "../../../data/projects";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-300 p-8 font-mono selection:bg-neutral-700">
      <div className="max-w-3xl mx-auto mt-24">
        <Link
          href="/"
          className="text-neutral-500 hover:text-white transition-colors uppercase text-sm tracking-widest mb-12 block"
        >
          ← Return to Base
        </Link>

        <header className="mb-16">
          <h1 className="text-4xl text-white font-bold mb-6 tracking-tighter">
            {project.title}
          </h1>
          <div className="flex flex-wrap gap-3">
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
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-sm text-neutral-500 text-sm">
            [Documentation pending execution. You must detail the mathematical
            logic and infrastructure choices here.]
          </div>
        </article>
      </div>
    </main>
  );
}
