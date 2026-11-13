import Reveal from "@/components/reveal";
import Section from "@/components/section-heading";
import { stackLayers } from "@/lib/site-data";

export default function SkillsSection() {
  return (
    <Section id="stack" label="Stack">
      <Reveal>
        <p className="max-w-2xl text-xl font-medium leading-snug tracking-tight sm:text-2xl">
          Strongest at the interface, comfortable one layer down, and able to take it all the way to a running server.
        </p>
      </Reveal>

      <div className="mt-10 divide-y divide-line border-y border-line">
        {stackLayers.map((layer) => (
          <Reveal key={layer.name} className="grid gap-x-8 gap-y-4 py-7 md:grid-cols-5">
            <div className="md:col-span-1">
              <h3 className="font-semibold">{layer.name}</h3>
              <p className="mt-1 text-sm leading-snug text-muted">{layer.note}</p>
            </div>
            <dl className="space-y-3 md:col-span-4">
              {layer.groups.map((group) => (
                <div key={group.label} className="grid gap-1 sm:grid-cols-[5.5rem_1fr] sm:gap-4">
                  <dt className="mono pt-0.5 text-muted">{group.label}</dt>
                  <dd className="text-[0.95rem] leading-relaxed">{group.items.join("  ·  ")}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
