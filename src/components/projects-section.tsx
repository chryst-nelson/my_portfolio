import Reveal from "@/components/reveal";
import SectionHeading from "@/components/section-heading";
import { projects } from "@/lib/site-data";

export default function ProjectsSection() {
  return (
    <section
      id="projects"
      className="border-t border-line bg-surface/40 py-24 lg:py-32"
    >
      <div className="wrap">
        <SectionHeading
          index="04"
          label="Projects"
          title={
            <>
              Selected <em className="text-accent">work.</em>
            </>
          }
        />

        <ol className="border-b border-line">
          {projects.map((project, i) => (
            <Reveal key={project.id}>
              <li className="grid gap-6 border-t border-line py-10 transition-colors hover:bg-surface/60 lg:grid-cols-12 lg:gap-8">
                <div className="eyebrow lg:col-span-3">
                  <p className="text-fg">
                    <span className="text-accent">
                      {String(i + 1).padStart(2, "0")}
                    </span>{" "}
                    / {project.kind}
                  </p>
                  {project.status === "in-progress" && (
                    <p className="mt-2 inline-block bg-accent px-2 py-1 !text-accent-fg">
                      In progress
                    </p>
                  )}
                </div>

                <div className="lg:col-span-9">
                  <h3 className="font-display text-3xl leading-tight sm:text-4xl">
                    {project.title}
                  </h3>
                  <p className="mt-4 max-w-2xl leading-relaxed text-muted">
                    {project.summary}
                  </p>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <li key={tech}>
                        <span className="chip">{tech}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
