export default function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="scroll-mt-28 py-20"
    >
      <div className="mb-8 flex items-center gap-4">
        <h2
          id="about-heading"
          className="text-lg uppercase tracking-widest text-white"
        >
          About
        </h2>

        <div className="h-px flex-grow bg-neutral-800" />
      </div>

      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <p className="leading-8 text-neutral-400">
            I am Syed Masood Hussain, a systems engineer and developer focused
            on building reliable software, intelligent systems, and
            production-minded applications.
          </p>

          <p className="mt-5 leading-8 text-neutral-400">
            My work includes computer vision, large language models, compiler
            design, chess engines, cloud infrastructure, and data-integrity
            systems. I enjoy understanding difficult technical problems and
            transforming them into structured, maintainable solutions.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="border border-neutral-800 bg-neutral-900/40 p-5">
            <p className="text-2xl font-bold text-white">Full Stack</p>
            <p className="mt-2 text-sm text-neutral-500">
              Frontend and backend development
            </p>
          </div>

          <div className="border border-neutral-800 bg-neutral-900/40 p-5">
            <p className="text-2xl font-bold text-white">Systems</p>
            <p className="mt-2 text-sm text-neutral-500">
              Reliable application architecture
            </p>
          </div>

          <div className="border border-neutral-800 bg-neutral-900/40 p-5">
            <p className="text-2xl font-bold text-white">AI</p>
            <p className="mt-2 text-sm text-neutral-500">
              Vision and language models
            </p>
          </div>

          <div className="border border-neutral-800 bg-neutral-900/40 p-5">
            <p className="text-2xl font-bold text-white">Cloud</p>
            <p className="mt-2 text-sm text-neutral-500">
              Deployment and infrastructure
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
