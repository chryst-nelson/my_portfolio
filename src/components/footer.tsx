import Link from "next/link";
import { navItems, profile } from "@/lib/site-data";

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="wrap flex flex-col gap-6 py-8 text-sm text-muted md:flex-row md:items-center md:justify-between">
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {navItems.map((item) => (
              <li key={item.id}>
                <Link href={`/#${item.id}`} className="transition-colors hover:text-fg">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/ask" className="transition-colors hover:text-fg">
                Assistant
              </Link>
            </li>
          </ul>
        </nav>
        <p className="mono">Next.js on Vercel · Spring Boot on AWS</p>
      </div>
    </footer>
  );
}
