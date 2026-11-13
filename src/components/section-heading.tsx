import type { ReactNode } from "react";

interface SectionProps {
  id: string;
  label: string;
  children: ReactNode;
}

/** Ruled section: a short label in the left rail, content on the right. */
export default function Section({ id, label, children }: SectionProps) {
  return (
    <section id={id} className="border-t border-line py-14 lg:py-20">
      <div className="wrap grid gap-x-10 gap-y-8 lg:grid-cols-12">
        <h2 className="label lg:col-span-3">
          <span className="lg:sticky lg:top-24 lg:block">{label}</span>
        </h2>
        <div className="lg:col-span-9">{children}</div>
      </div>
    </section>
  );
}
