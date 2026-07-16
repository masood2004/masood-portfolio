import ProjectCard from "../components/ProjectCard";
import Navbar from "../components/Navbar";
import About from "../components/About";
import Skills from "../components/Skills";
import Experience from "../components/Experience";
import ContactForm from "../components/ContactForm";
import Footer from "../components/Footer";

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
    <>
      <Navbar />

      <main className="min-h-screen bg-neutral-950 font-mono text-neutral-300 selection:bg-neutral-700">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personJsonLd),
          }}
        />

        <div className="mx-auto max-w-6xl px-6">
          <header
            id="home"
            className="flex min-h-screen scroll-mt-24 flex-col justify-center py-28"
          >
            <p className="mb-4 text-sm uppercase tracking-[0.25em] text-neutral-500">
              {professionalTitle} Portfolio
            </p>

            <h1 className="max-w-4xl text-5xl font-bold tracking-tighter text-white md:text-7xl">
              {personName}
            </h1>

            <p className="mt-7 max-w-3xl text-base leading-8 text-neutral-400 md:text-lg">
              {siteDescription} This portfolio documents production-minded work
              across vision systems, chess-engine development, compiler
              pipelines, and database reliability.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <a
                href="#projects"
                className="border border-white bg-white px-6 py-3 text-sm font-bold text-neutral-950 transition hover:bg-neutral-300"
              >
                View projects
              </a>

              <a
                href="#contact"
                className="border border-neutral-700 px-6 py-3 text-sm font-bold text-white transition hover:border-neutral-400"
              >
                Contact me
              </a>
            </div>
          </header>

          <About />

          <Skills />

          <section
            id="projects"
            aria-labelledby="projects-heading"
            className="scroll-mt-28 py-20"
          >
            <div className="mb-8 flex items-center gap-4">
              <h2
                id="projects-heading"
                className="text-lg uppercase tracking-widest text-white"
              >
                Deployed Architecture
              </h2>

              <div className="h-px flex-grow bg-neutral-800" />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </section>

          <Experience />

          <ContactForm />
        </div>
      </main>

      <Footer />
    </>
  );
}
