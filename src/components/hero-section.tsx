"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, MessageSquare } from "lucide-react";
import LocalTime from "@/components/local-time";
import RequestPath from "@/components/request-path";
import { profile } from "@/lib/site-data";

export default function HeroSection() {
  const reduce = useReducedMotion();
  const fade = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, delay, ease: "easeOut" as const },
        };

  return (
    <section id="home" className="pb-16 pt-28 sm:pt-32 lg:pb-24">
      <div className="wrap grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <motion.p {...fade(0)} className="mono text-muted">
            {profile.name} · {profile.location} · <LocalTime timeZone={profile.timezone} label="WAT" />
          </motion.p>

          <motion.h1
            {...fade(0.05)}
            className="mt-6 text-[clamp(2.35rem,5.4vw,4.4rem)] font-semibold leading-[1.04] tracking-[-0.035em]"
          >
            Frontend engineer who also builds the API and{" "}
            <span className="marker">ships it.</span>
          </motion.h1>

          <motion.p {...fade(0.12)} className="mt-7 max-w-xl text-[1.0625rem] leading-relaxed text-muted">
            {profile.summary}
          </motion.p>

          <motion.div {...fade(0.18)} className="mt-9 flex flex-wrap gap-3">
            <a href="#work" className="btn btn-solid">
              See the work
              <ArrowDown className="h-4 w-4" aria-hidden="true" />
            </a>
            <Link href="/ask" className="btn">
              Ask the assistant
              <MessageSquare className="h-4 w-4" aria-hidden="true" />
            </Link>
            <a href={profile.resume} target="_blank" rel="noopener noreferrer" className="btn border-transparent !px-2 hover:underline">
              Résumé (PDF)
            </a>
          </motion.div>

          <motion.dl
            {...fade(0.24)}
            className="mt-14 grid max-w-xl gap-x-8 gap-y-4 border-t border-line pt-6 text-sm sm:grid-cols-2"
          >
            <div>
              <dt className="text-muted">Looking for</dt>
              <dd className="mt-0.5">{profile.openTo}</dd>
            </div>
            <div>
              <dt className="text-muted">Day to day</dt>
              <dd className="mt-0.5">React, Next.js, Tailwind, Spring Boot, Docker</dd>
            </div>
          </motion.dl>
        </div>

        <motion.figure {...fade(0.15)} className="lg:col-span-5">
          <div className="mx-auto max-w-[22rem] lg:ml-auto lg:mr-0">
            <RequestPath className="w-full" />
            <figcaption className="mono mt-4 text-muted">
              How this site runs, from the browser to the deploy.
            </figcaption>
          </div>
        </motion.figure>
      </div>
    </section>
  );
}
