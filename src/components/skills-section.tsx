import Reveal from "@/components/reveal";
import SectionHeading from "@/components/section-heading";
import { skillGroups } from "@/lib/site-data";

export default function SkillsSection() {
  return (
    <section
      id="skills"
      className="border-t border-line bg-surface/40 py-24 lg:py-32"
    >
      <div className="wrap">
        <SectionHeading
          index="02"
          label="Skills"
          title={
            <>
              The toolkit I <em className="text-accent">reach for.</em>
            </>
          }
        />

        <div className="border-t border-line">
          {skillGroups.map((group, i) => (
            <Reveal
              key={group.label}
              delay={i * 0.05}
              className="grid gap-5 border-b border-line py-8 lg:grid-cols-12"
            >
              <h3 className="eyebrow lg:col-span-3">
                <span className="text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>{" "}
                {group.label}
              </h3>
              <ul className="flex flex-wrap gap-2 lg:col-span-9">
                {group.items.map((item) => (
                  <li key={item.name}>
                    <span
                      className={`chip ${item.learning ? "chip-dashed" : ""}`}
                    >
                      {item.name}
                      {item.learning && (
                        <span className="text-[10px] uppercase tracking-widest text-accent">
                          learning
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
