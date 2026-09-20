"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  Check,
  Copy,
  Github,
  Linkedin,
  Mail,
  Twitter,
} from "lucide-react";
import Reveal from "@/components/reveal";
import SectionHeading from "@/components/section-heading";
import { profile, socials } from "@/lib/site-data";

const socialLinks = [
  { name: "GitHub", href: socials.github, icon: Github },
  { name: "LinkedIn", href: socials.linkedin, icon: Linkedin },
  { name: "X / Twitter", href: socials.twitter, icon: Twitter },
];

export default function ContactSection() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* Clipboard unavailable — the mailto link still works. */
    }
  };

  return (
    <section id="contact" className="py-24 lg:py-32">
      <div className="wrap">
        <SectionHeading
          index="05"
          label="Contact"
          title={
            <>
              Have a role or project in mind?{" "}
              <em className="text-accent">Let&apos;s talk.</em>
            </>
          }
        />

        <div className="grid gap-16 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <p className="eyebrow mb-4">Email</p>
            <a
              href={`mailto:${profile.email}`}
              className="block break-all font-display text-4xl leading-tight underline decoration-line-strong decoration-1 underline-offset-8 transition-colors hover:text-accent hover:decoration-accent sm:text-5xl lg:text-6xl"
            >
              {profile.email}
            </a>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a href={`mailto:${profile.email}`} className="btn btn-solid">
                <Mail className="h-4 w-4" aria-hidden="true" />
                Send an email
              </a>
              <button type="button" onClick={copyEmail} className="btn">
                {copied ? (
                  <Check className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Copy className="h-4 w-4" aria-hidden="true" />
                )}
                <span aria-live="polite">
                  {copied ? "Copied" : "Copy address"}
                </span>
              </button>
            </div>
          </Reveal>

          <Reveal className="space-y-12 lg:col-span-5" delay={0.1}>
            <dl className="divide-y divide-line border-y border-line">
              <div className="flex items-baseline justify-between gap-6 py-4">
                <dt className="eyebrow">Phone</dt>
                <dd>
                  <a
                    href={profile.phoneHref}
                    className="transition-colors hover:text-accent"
                  >
                    {profile.phone}
                  </a>
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-6 py-4">
                <dt className="eyebrow">Location</dt>
                <dd>{profile.location} · WAT (UTC+1)</dd>
              </div>
            </dl>

            <div>
              <p className="eyebrow mb-4">Elsewhere</p>
              <ul className="divide-y divide-line border-y border-line">
                {socialLinks.map(({ name, href, icon: Icon }) => (
                  <li key={name}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between gap-4 py-4 transition-colors hover:text-accent"
                    >
                      <span className="flex items-center gap-3">
                        <Icon
                          className="h-4 w-4 text-muted transition-colors group-hover:text-accent"
                          aria-hidden="true"
                        />
                        {name}
                      </span>
                      <ArrowUpRight
                        className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
