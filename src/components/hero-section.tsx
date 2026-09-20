"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowUpRight, Download } from "lucide-react";
import LocalTime from "@/components/local-time";
import { profile } from "@/lib/site-data";

const facts = [
  { label: "Focus", value: "React · Next.js · React Native" },
  { label: "Now", value: profile.now },
  { label: "Last role", value: "NdiliaTalent (Remote), 2025 – 2026" },
];

export default function HeroSection() {
  const reduce = useReducedMotion();

  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 28 },
          animate: { opacity: 1, y: 0 },
          transition: {
            duration: 0.8,
            delay,
            ease: [0.22, 1, 0.36, 1] as const,
          },
        };

  return (
    <section
      id="home"
      className="relative isolate overflow-hidden pb-16 pt-28 sm:pt-32"
    >
      <div aria-hidden="true" className="grid-bg absolute inset-0 -z-10" />

      <div className="wrap">
        {/* Status bar */}
        <motion.div
          {...rise(0)}
          className="eyebrow flex flex-wrap items-center justify-between gap-x-6 gap-y-2"
        >
          <span className="flex items-center gap-2.5">
            <span
              className="pulse-dot h-2 w-2 rounded-full bg-accent"
              aria-hidden="true"
            />
            {profile.availability}
          </span>
          <span>
            {profile.location} ·{" "}
            <LocalTime timeZone={profile.timezone} label="WAT" />
          </span>
        </motion.div>

        <div className="mt-14 lg:mt-24">
          <h1>
            <motion.span {...rise(0.1)} className="eyebrow block">
              {profile.name} — {profile.role}
            </motion.span>
            <motion.span
              {...rise(0.2)}
              className="mt-6 block max-w-6xl font-display text-[clamp(3.25rem,9.5vw,9rem)] leading-[0.93] tracking-[-0.02em]"
            >
              Building responsive web &amp; mobile{" "}
              <em className="text-accent">interfaces.</em>
            </motion.span>
          </h1>

          <motion.p
            {...rise(0.35)}
            className="mt-10 max-w-2xl text-lg leading-relaxed text-muted"
          >
            {profile.summary}
          </motion.p>

          <motion.div {...rise(0.45)} className="mt-10 flex flex-wrap gap-3">
            <a href="#projects" className="btn btn-solid">
              View projects
              <ArrowDown className="h-4 w-4" aria-hidden="true" />
            </a>
            <a href={profile.resume} download className="btn">
              <Download className="h-4 w-4" aria-hidden="true" />
              Download résumé
            </a>
            <a
              href="#contact"
              className="btn border-transparent !px-2 underline-offset-4 hover:underline"
            >
              Get in touch
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </motion.div>
        </div>

        {/* Facts */}
        <motion.dl
          {...rise(0.6)}
          className="mt-20 grid gap-px border border-line bg-line sm:grid-cols-3"
        >
          {facts.map((fact) => (
            <div key={fact.label} className="bg-bg p-5">
              <dt className="eyebrow">{fact.label}</dt>
              <dd className="mt-2 text-sm leading-relaxed">{fact.value}</dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
