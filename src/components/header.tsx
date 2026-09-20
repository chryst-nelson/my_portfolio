"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import ThemeToggle from "@/components/theme-toggle";
import { navItems, profile } from "@/lib/site-data";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");
  const menuRef = useRef<HTMLDivElement>(null);

  // Border + blur once the page has scrolled.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy for the active nav item.
  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // Mobile menu: lock scroll, close on Escape, trap focus.
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusable = () =>
      Array.from(
        menuRef.current?.querySelectorAll<HTMLElement>("a[href], button") ?? [],
      );
    focusable()[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab") return;

      const items = focusable();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          scrolled || open
            ? "border-b border-line bg-bg/85 backdrop-blur-md"
            : "border-b border-transparent"
        }`}
      >
        <div className="wrap flex h-16 items-center justify-between">
          <Link
            href="#home"
            className="group flex items-center gap-2.5 font-mono text-sm tracking-tight"
            aria-label={`${profile.name} — back to top`}
            onClick={() => setOpen(false)}
          >
            <span
              className="grid h-8 w-8 place-items-center border border-line-strong font-display text-lg leading-none transition-colors group-hover:border-accent group-hover:text-accent"
              aria-hidden="true"
            >
              ac
            </span>
            <span className="hidden sm:inline">
              {profile.handle}
              <span className="text-accent">.</span>dev
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-8">
              {navItems.map((item) => {
                const isActive = active === item.id;
                return (
                  <li key={item.id}>
                    <Link
                      href={`#${item.id}`}
                      aria-current={isActive ? "true" : undefined}
                      className={`group relative flex items-baseline gap-1.5 py-2 text-sm transition-colors ${
                        isActive ? "text-fg" : "text-muted hover:text-fg"
                      }`}
                    >
                      <span className="font-mono text-[10px] text-accent">
                        {item.index}
                      </span>
                      {item.label}
                      <span
                        className={`absolute inset-x-0 -bottom-px h-px origin-left bg-accent transition-transform duration-300 ${
                          isActive
                            ? "scale-x-100"
                            : "scale-x-0 group-hover:scale-x-100"
                        }`}
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={profile.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="btn hidden !px-4 !py-2.5 sm:inline-flex"
            >
              Résumé
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <ThemeToggle />
            <button
              type="button"
              className="grid h-10 w-10 place-items-center border border-line-strong md:hidden"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
            >
              {open ? (
                <X className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Menu className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Rendered outside <header>: its backdrop-filter would otherwise become the containing block for this fixed overlay. */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            ref={menuRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto bg-bg md:hidden"
          >
            <nav
              aria-label="Mobile"
              className="wrap flex min-h-full flex-col py-8"
            >
              <ul className="divide-y divide-line border-y border-line">
                {navItems.map((item, i) => (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + i * 0.05, duration: 0.35 }}
                  >
                    <Link
                      href={`#${item.id}`}
                      onClick={() => setOpen(false)}
                      className="flex items-baseline gap-4 py-5 font-display text-4xl"
                    >
                      <span className="font-mono text-xs text-accent">
                        {item.index}
                      </span>
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <a
                href={profile.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-solid mt-8 w-full"
              >
                View résumé
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
