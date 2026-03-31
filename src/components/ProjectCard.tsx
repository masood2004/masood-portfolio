import Link from "next/link";
import { Project } from "../types";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/projects/${project.id}`} className="block group">
      <div className="border border-neutral-800 p-6 bg-neutral-900/50 rounded-sm group-hover:border-neutral-500 transition-colors duration-300 h-full flex flex-col">
        <h3 className="text-xl text-white font-bold mb-2 tracking-tight">
          {project.title}
        </h3>
        <p className="text-neutral-400 text-sm mb-6 leading-relaxed flex-grow">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2 mt-auto">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="text-xs font-medium bg-neutral-950 text-neutral-300 px-2 py-1 rounded border border-neutral-800 uppercase tracking-wider"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
