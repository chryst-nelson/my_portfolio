import type React from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-fg"
      >
        Skip to content
      </a>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
