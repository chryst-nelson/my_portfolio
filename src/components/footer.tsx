"use client";

import Link from "next/link";
import { ArrowUp, Github, Linkedin, Mail, Twitter } from "lucide-react";
import { navItems, profile, socials } from "@/lib/site-data";

const socialLinks = [
  { name: "GitHub", href: socials.github, icon: Github },
  { name: "LinkedIn", href: socials.linkedin, icon: Linkedin },
  { name: "X / Twitter", href: socials.twitter, icon: Twitter },
  { name: "Email", href: `mailto:${profile.email}`, icon: Mail },
];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-surface/40">
      <div className="wrap py-16 lg:py-20">
        <p
          className="font-display text-[clamp(3rem,11vw,9.5rem)] leading-[0.9] tracking-[-0.02em]"
          aria-hidden="true"
        >
          {profile.shortName}
          <br />
          <em className="text-accent">Chigozie.</em>
        </p>

        <div className="mt-14 grid gap-10 border-t border-line pt-8 md:grid-cols-12">
          <nav aria-label="Footer" className="md:col-span-6">
            <ul className="flex flex-wrap gap-x-8 gap-y-3">
              {navItems.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`#${item.id}`}
                    className="text-sm text-muted transition-colors hover:text-accent"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <ul className="flex items-center gap-2 md:col-span-4">
            {socialLinks.map(({ name, href, icon: Icon }) => (
              <li key={name}>
                <a
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  aria-label={name}
                  className="grid h-10 w-10 place-items-center border border-line-strong transition-colors hover:border-accent hover:text-accent"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>

          <div className="md:col-span-2 md:text-right">
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="eyebrow inline-flex items-center gap-2 !text-fg transition-colors hover:!text-accent"
            >
              Back to top
              <ArrowUp className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <p className="eyebrow mt-12 flex flex-wrap justify-between gap-2">
          <span>
            © {new Date().getFullYear()} {profile.name}
          </span>
          <span>Built with Next.js, Tailwind CSS &amp; Framer Motion</span>
        </p>
      </div>
    </footer>
  );
}
