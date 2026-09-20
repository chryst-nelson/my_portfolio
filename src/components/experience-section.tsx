import Reveal from "@/components/reveal";
import SectionHeading from "@/components/section-heading";
import { experience } from "@/lib/site-data";

export default function ExperienceSection() {
  return (
    <section id="experience" className="py-24 lg:py-32">
      <div className="wrap">
        <SectionHeading
          index="03"
          label="Experience"
          title={
            <>
              Where I&apos;ve <em className="text-accent">shipped.</em>
            </>
          }
        />

        <div className="border-b border-line">
          {experience.map((entry) => (
            <Reveal key={`${entry.company}-${entry.period}`}>
              <article className="grid gap-6 border-t border-line py-10 transition-colors hover:bg-surface/60 lg:grid-cols-12 lg:gap-8">
                <div className="eyebrow lg:col-span-3">
                  <p className="text-fg">{entry.period}</p>
                  <p className="mt-2">{entry.mode}</p>
                </div>

                <div className="lg:col-span-9">
                  <h3 className="font-display text-3xl leading-tight sm:text-4xl">
                    {entry.role}
                  </h3>
                  <p className="mt-2 text-muted">{entry.company}</p>

                  {entry.highlight && (
                    <div className="mt-8 flex items-center gap-5 border border-line-strong p-5 sm:max-w-md">
                      <span className="font-display text-6xl leading-none text-accent">
                        {entry.highlight.value}
                      </span>
                      <span className="text-sm leading-snug text-muted">
                        {entry.highlight.label}
                      </span>
                    </div>
                  )}

                  <ul className="mt-8 space-y-3">
                    {entry.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-4 leading-relaxed">
                        <span
                          className="mt-[0.7em] h-px w-4 shrink-0 bg-accent"
                          aria-hidden="true"
                        />
                        <span className="text-muted">{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  <ul className="mt-8 flex flex-wrap gap-2">
                    {entry.tags.map((tag) => (
                      <li key={tag}>
                        <span className="chip">{tag}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
