import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/reveal";
import Section from "@/components/section-heading";
import { projects, socials } from "@/lib/site-data";

export default function ProjectsSection() {
  return (
    <Section id="work" label="Selected work">
      <ol className="divide-y divide-line border-y border-line">
        {projects.map((project, i) => (
          <li key={project.id}>
            <Reveal className="grid gap-x-8 gap-y-5 py-9 first:pt-8 md:grid-cols-5">
              <div className="md:col-span-2">
                <p className="mono text-muted">{String(i + 1).padStart(2, "0")} · {project.kind}</p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight">{project.title}</h3>
                <p className="mono mt-4 leading-relaxed text-muted">{project.technologies.join(" / ")}</p>
              </div>

              <div className="md:col-span-3">
                <p className="leading-relaxed">{project.summary}</p>

                {project.layers && (
                  <dl className="mt-6 divide-y divide-line border-t border-line text-sm">
                    {project.layers.map((layer) => (
                      <div key={layer.name} className="grid gap-1 py-3 sm:grid-cols-[6.5rem_1fr] sm:gap-4">
                        <dt className="font-semibold">{layer.name}</dt>
                        <dd className="leading-relaxed text-muted">{layer.text}</dd>
                      </div>
                    ))}
                  </dl>
                )}

                {project.link && (
                  <Link href={project.link.href} className="link mt-5 inline-flex items-center gap-1.5 text-sm font-medium">
                    {project.link.label}
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                )}
              </div>
            </Reveal>
          </li>
        ))}
      </ol>

      <p className="mt-6 text-sm text-muted">
        More code on{" "}
        <a href={socials.github} target="_blank" rel="noopener noreferrer" className="link text-fg">
          GitHub
        </a>
        .
      </p>
    </Section>
  );
}
