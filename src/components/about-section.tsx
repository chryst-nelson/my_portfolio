import Reveal from "@/components/reveal";
import Section from "@/components/section-heading";
import { about } from "@/lib/site-data";

export default function AboutSection() {
  return (
    <Section id="about" label="About">
      <div className="grid gap-x-10 gap-y-10 md:grid-cols-5">
        <Reveal className="space-y-5 text-[1.0625rem] leading-relaxed md:col-span-3">
          {about.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </Reveal>

        <Reveal className="md:col-span-2" delay={0.05}>
          <h3 className="label">Education</h3>
          <ul className="mt-3 divide-y divide-line border-y border-line">
            {about.education.map((item) => (
              <li key={item.title} className="py-4">
                <p className="font-medium leading-snug">{item.title}</p>
                <p className="mt-1 text-sm text-muted">{item.place}</p>
                <p className="mono mt-1 text-muted">{item.period}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}
