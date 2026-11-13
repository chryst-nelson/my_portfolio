"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Copy } from "lucide-react";
import Reveal from "@/components/reveal";
import Section from "@/components/section-heading";
import { profile, socials } from "@/lib/site-data";

const elsewhere = [
  { name: "GitHub", href: socials.github },
  { name: "LinkedIn", href: socials.linkedin },
  { name: "X", href: socials.twitter },
];

export default function ContactSection() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* Clipboard unavailable; the mailto link still works. */
    }
  };

  return (
    <Section id="contact" label="Contact">
      <Reveal>
        <p className="max-w-xl text-xl font-medium leading-snug tracking-tight sm:text-2xl">
          Hiring for a frontend or full-stack role, or have something to build? Email is the quickest way to reach me.
        </p>

        <a
          href={`mailto:${profile.email}`}
          className="link mt-8 block break-all text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl"
        >
          {profile.email}
        </a>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button type="button" onClick={copyEmail} className="btn">
            {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
            <span aria-live="polite">{copied ? "Copied" : "Copy address"}</span>
          </button>
          <Link href="/ask" className="btn">
            Or ask the assistant first
          </Link>
        </div>

        <dl className="mt-12 grid max-w-xl gap-y-3 border-t border-line pt-6 text-sm sm:grid-cols-[7rem_1fr]">
          <dt className="text-muted">Phone</dt>
          <dd>
            <a href={profile.phoneHref} className="link">
              {profile.phone}
            </a>
          </dd>
          <dt className="text-muted">Based in</dt>
          <dd>{profile.location} · WAT (UTC+1)</dd>
          <dt className="text-muted">Elsewhere</dt>
          <dd className="flex flex-wrap gap-x-5 gap-y-1">
            {elsewhere.map((item) => (
              <a key={item.name} href={item.href} target="_blank" rel="noopener noreferrer" className="link">
                {item.name}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            ))}
          </dd>
        </dl>
      </Reveal>
    </Section>
  );
}
