const timeline = [
  {
    period: "Present",
    title: "Systems Engineering and Software Development",
    organisation: "Independent Projects",
    description:
      "Building production-minded projects involving computer vision, infrastructure, compilers, databases, and intelligent systems.",
  },
  {
    period: "2026",
    title: "MERN Stack Intern",
    organisation: "Dafi Labs × EmpRadar.ai",
    description:
      "Developing a full-stack portfolio, Supabase contact system, authentication flow, Admin dashboard, and deployment pipeline.",
  },
  {
    period: "Education",
    title: "Computer Science",
    organisation: "Academic Study",
    description:
      "Studying software engineering, programming, databases, artificial intelligence, computer systems, and related computing disciplines.",
  },
];

export default function Experience() {
  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className="scroll-mt-28 py-20"
    >
      <div className="mb-8 flex items-center gap-4">
        <h2
          id="experience-heading"
          className="text-lg uppercase tracking-widest text-white"
        >
          Experience / Education
        </h2>

        <div className="h-px flex-grow bg-neutral-800" />
      </div>

      <div className="border-l border-neutral-700 pl-7">
        {timeline.map((item) => (
          <article
            key={`${item.period}-${item.title}`}
            className="relative mb-10"
          >
            <div className="absolute -left-[33px] top-2 h-3 w-3 rounded-full border border-neutral-500 bg-neutral-950" />

            <p className="mb-2 text-xs uppercase tracking-widest text-neutral-500">
              {item.period}
            </p>

            <h3 className="text-xl font-bold text-white">{item.title}</h3>

            <p className="mt-1 text-sm text-neutral-300">{item.organisation}</p>

            <p className="mt-4 max-w-2xl leading-7 text-neutral-400">
              {item.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
