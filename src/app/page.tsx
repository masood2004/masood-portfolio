import ProjectCard from "../components/ProjectCard";
import { projects } from "../data/projects";
import {
  absoluteUrl,
  githubProfile,
  linkedinProfile,
  personName,
  professionalTitle,
  profileEmail,
  siteDescription,
} from "./seo";

export default function Home() {
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: personName,
    jobTitle: professionalTitle,
    url: absoluteUrl("/"),
    email: profileEmail,
    sameAs: [githubProfile, linkedinProfile],
    knowsAbout: [
      "Systems Engineering",
      "Computer Vision",
      "Large Language Models",
      "Compiler Design",
      "Chess Engines",
      "Data Integrity",
      "Cloud Infrastructure",
    ],
    hasPart: projects.map((project) => ({
      "@type": "CreativeWork",
      name: project.title,
      description: project.description,
      url: absoluteUrl(`/projects/${project.id}`),
      keywords: project.techStack.join(", "),
    })),
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-300 p-8 font-mono selection:bg-neutral-700">
      {/* Structured data gives search engines machine-readable context about
          the owner, expertise areas, and internal project relationships. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />

      <div className="max-w-4xl mx-auto mt-24">
        <header className="mb-20">
          <p className="text-sm uppercase tracking-widest text-neutral-500 mb-3">
            {professionalTitle} Portfolio
          </p>
          <h1 className="text-5xl text-white font-bold mb-4 tracking-tighter">
            {personName}
          </h1>
          <p className="max-w-2xl text-base leading-7 text-neutral-400">
            {siteDescription} This portfolio documents production-minded work
            across vision systems, chess engine development, compiler pipelines,
            and database reliability.
          </p>
        </header>

        <section aria-labelledby="projects-heading">
          <div className="flex items-center gap-4 mb-8">
            <h2
              id="projects-heading"
              className="text-lg text-white uppercase tracking-widest"
            >
              Deployed Architecture
            </h2>
            <div className="h-[1px] bg-neutral-800 flex-grow" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
