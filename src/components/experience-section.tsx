import Reveal from "@/components/reveal";
import Section from "@/components/section-heading";
import { experience } from "@/lib/site-data";

export default function ExperienceSection() {
  return (
    <Section id="experience" label="Experience">
      <ol className="divide-y divide-line border-y border-line">
        {experience.map((job) => (
          <li key={`${job.company}-${job.period}`}>
            <Reveal className="grid gap-x-8 gap-y-4 py-8 md:grid-cols-5">
              <div className="md:col-span-2">
                <p className="mono text-muted">{job.period}</p>
                <h3 className="mt-2 text-xl font-semibold tracking-tight">{job.role}</h3>
                <p className="mt-1 text-muted">
                  {job.company} · {job.mode}
                </p>
                {job.highlight && (
                  <p className="mt-5 flex items-baseline gap-3">
                    <span className="text-4xl font-semibold tracking-tight text-accent">{job.highlight.value}</span>
                    <span className="max-w-[11rem] text-sm leading-snug text-muted">{job.highlight.label}</span>
                  </p>
                )}
              </div>
              <ul className="space-y-3 md:col-span-3">
                {job.bullets.map((bullet) => (
                  <li key={bullet} className="relative pl-5 leading-relaxed before:absolute before:left-0 before:top-[0.72em] before:h-px before:w-3 before:bg-line-strong">
                    {bullet}
                  </li>
                ))}
              </ul>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  );
}
