import Reveal from "@/components/reveal";
import SectionHeading from "@/components/section-heading";
import { about } from "@/lib/site-data";

export default function AboutSection() {
  return (
    <section
      id="about"
      className="py-24 lg:py-32"
      aria-labelledby="about-title"
    >
      <div className="wrap">
        <SectionHeading
          index="01"
          label="About"
          title={
            <span id="about-title">
              A frontend developer with a{" "}
              <em className="text-accent">backend curiosity.</em>
            </span>
          }
        />

        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-9 lg:col-start-4">
            <Reveal>
              <p className="font-display text-3xl leading-snug sm:text-4xl">
                {about.lead}
              </p>
              <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted">
                {about.body}
              </p>
            </Reveal>

            {/* What I do */}
            <Reveal className="mt-16">
              <h3 className="eyebrow mb-6">What I do</h3>
              <ol className="grid gap-px border border-line bg-line sm:grid-cols-2">
                {about.focus.map((item, i) => (
                  <li
                    key={item.title}
                    className="bg-bg p-6 transition-colors hover:bg-surface"
                  >
                    <span className="font-mono text-xs text-accent">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h4 className="mt-3 font-display text-2xl">{item.title}</h4>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {item.text}
                    </p>
                  </li>
                ))}
              </ol>
            </Reveal>

            {/* Education */}
            <Reveal className="mt-16 grid gap-12 sm:grid-cols-2">
              <div>
                <h3 className="eyebrow mb-6">Education</h3>
                <ul className="divide-y divide-line border-y border-line">
                  {about.education.map((item) => (
                    <li key={item.title} className="py-5">
                      <p className="font-medium">{item.title}</p>
                      <p className="mt-1 text-sm text-muted">{item.place}</p>
                      <p className="eyebrow mt-2">{item.period}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="eyebrow mb-6">Certifications &amp; training</h3>
                <ul className="divide-y divide-line border-y border-line">
                  {about.certifications.map((item) => (
                    <li key={item.title} className="py-5">
                      <p className="font-medium">{item.title}</p>
                      <p className="mt-1 text-sm text-muted">{item.place}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
