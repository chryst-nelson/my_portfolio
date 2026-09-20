import type { ReactNode } from "react";

interface SectionHeadingProps {
  index: string;
  label: string;
  title: ReactNode;
}

export default function SectionHeading({
  index,
  label,
  title,
}: SectionHeadingProps) {
  return (
    <div className="mb-12 grid gap-5 border-t border-line pt-6 lg:mb-16 lg:grid-cols-12">
      <p className="eyebrow lg:col-span-3">
        <span className="text-accent">{index}</span>
        <span aria-hidden="true"> / </span>
        {label}
      </p>
      <h2 className="font-display text-4xl leading-[1.03] tracking-tight sm:text-5xl lg:col-span-9 lg:text-6xl">
        {title}
      </h2>
    </div>
  );
}
