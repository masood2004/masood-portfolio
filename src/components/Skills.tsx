const skillGroups = [
  {
    title: "Frontend",
    skills: ["React", "Next.js", "TypeScript", "JavaScript", "HTML", "CSS"],
  },
  {
    title: "Backend",
    skills: ["Node.js", "Express.js", "REST APIs", "Python"],
  },
  {
    title: "Database",
    skills: ["PostgreSQL", "Supabase", "Prisma", "MongoDB", "MySQL"],
  },
  {
    title: "Tools and Infrastructure",
    skills: ["Git", "GitHub", "Vercel", "Docker", "Linux", "VS Code"],
  },
];

export default function Skills() {
  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="scroll-mt-28 py-20"
    >
      <div className="mb-8 flex items-center gap-4">
        <h2
          id="skills-heading"
          className="text-lg uppercase tracking-widest text-white"
        >
          Skills
        </h2>

        <div className="h-px flex-grow bg-neutral-800" />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {skillGroups.map((group) => (
          <article
            key={group.title}
            className="border border-neutral-800 bg-neutral-900/40 p-6"
          >
            <h3 className="mb-5 text-lg font-bold text-white">{group.title}</h3>

            <div className="flex flex-wrap gap-2">
              {group.skills.map((skill) => (
                <span
                  key={skill}
                  className="border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs uppercase tracking-wider text-neutral-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
