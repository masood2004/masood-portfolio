import ProjectCard from "../components/ProjectCard";
import { projects } from "../data/projects";

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-300 p-8 font-mono selection:bg-neutral-700">
      <div className="max-w-4xl mx-auto mt-24">
        <header className="mb-20">
          <h1 className="text-5xl text-white font-bold mb-4 tracking-tighter">
            Syed Masood Hussain
          </h1>
          <p className="text-sm uppercase tracking-widest text-neutral-500">
            Systems Engineer
          </p>
        </header>

        <section>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-lg text-white uppercase tracking-widest">
              Deployed Architecture
            </h2>
            <div className="h-[1px] bg-neutral-800 flex-grow"></div>
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
