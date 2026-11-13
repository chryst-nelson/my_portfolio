"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import ThemeToggle from "@/components/theme-toggle";
import { navItems, profile } from "@/lib/site-data";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy for the active nav item.
  useEffect(() => {
    const sections = ["home", ...navItems.map((item) => item.id)]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id === "home" ? "" : entry.target.id);
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
      Array.from(menuRef.current?.querySelectorAll<HTMLElement>("a[href], button") ?? []);
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
        className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-200 ${
          scrolled || open ? "border-line bg-bg/90 backdrop-blur" : "border-transparent"
        }`}
      >
        <div className="wrap flex h-14 items-center justify-between">
          <Link
            href="/"
            className="flex items-baseline gap-3"
            aria-label={`${profile.name}, home`}
            onClick={() => setOpen(false)}
          >
            <span className="text-[0.95rem] font-semibold tracking-tight">{profile.shortName}</span>
            <span className="mono hidden text-muted lg:inline">{profile.role}</span>
          </Link>

          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-7">
              {navItems.map((item) => {
                const isActive = active === item.id;
                return (
                  <li key={item.id}>
                    <Link
                      href={`/#${item.id}`}
                      aria-current={isActive ? "true" : undefined}
                      className={`border-b py-1 text-sm transition-colors ${
                        isActive
                          ? "border-accent text-fg"
                          : "border-transparent text-muted hover:text-fg"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/ask" className="btn btn-solid hidden !px-3.5 !py-2 sm:inline-flex">
              Ask the assistant
            </Link>
            <ThemeToggle />
            <button
              type="button"
              className="grid h-9 w-9 place-items-center border border-line-strong md:hidden"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
            >
              {open ? <X className="h-4 w-4" aria-hidden="true" /> : <Menu className="h-4 w-4" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </header>

      {/* Outside <header>: its backdrop-filter would become the containing block of this fixed overlay. */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            ref={menuRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-x-0 bottom-0 top-14 z-40 overflow-y-auto bg-bg md:hidden"
          >
            <nav aria-label="Mobile" className="wrap flex min-h-full flex-col py-6">
              <ul className="divide-y divide-line border-y border-line">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/#${item.id}`}
                      onClick={() => setOpen(false)}
                      className="block py-4 text-2xl font-semibold tracking-tight"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href="/ask" onClick={() => setOpen(false)} className="btn btn-solid mt-6 w-full">
                Ask the assistant
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
