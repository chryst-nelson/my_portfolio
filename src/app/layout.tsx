import type React from "react";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { profile, socials } from "@/lib/site-data";

// Self-hosted (SIL OFL) so builds and CI never depend on Google Fonts.
const geist = localFont({
  src: "../fonts/Geist-Variable.woff2",
  weight: "100 900",
  variable: "--font-geist",
  display: "swap",
});
const geistMono = localFont({
  src: "../fonts/GeistMono-Variable.woff2",
  weight: "100 900",
  variable: "--font-geist-mono",
  display: "swap",
});
const instrument = localFont({
  src: [
    {
      path: "../fonts/InstrumentSerif-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/InstrumentSerif-Italic.woff2",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-instrument",
  display: "swap",
});

const title = `${profile.name} — ${profile.role}`;
const description = `${profile.role} building responsive web and mobile apps with React, Next.js, Tailwind CSS and React Native. Also growing in Spring Boot and Java.`;

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title,
  description,
  keywords: [
    "Frontend Developer",
    "React",
    "Next.js",
    "Tailwind CSS",
    "React Native",
    "Spring Boot",
    "portfolio",
    "Nigeria",
  ],
  authors: [{ name: profile.name, url: profile.siteUrl }],
  openGraph: {
    title,
    description,
    url: profile.siteUrl,
    siteName: `${profile.shortName} — Portfolio`,
    type: "website",
  },
  twitter: {
    card: "summary",
    title,
    description,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f2ea" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0c0d" },
  ],
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  alternateName: "ChigoLite",
  jobTitle: profile.role,
  url: profile.siteUrl,
  email: `mailto:${profile.email}`,
  sameAs: [socials.github, socials.linkedin, socials.twitter],
  knowsAbout: [
    "React",
    "Next.js",
    "Tailwind CSS",
    "React Native",
    "Spring Boot",
  ],
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Enugu State University of Science and Technology",
  },
};

const gaId = process.env.NEXT_PUBLIC_GA_ID;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable} ${instrument.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body>
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="dark"
          themes={["light", "dark"]}
          enableSystem={false}
        >
          <a
            href="#about"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-fg"
          >
            Skip to content
          </a>
          <Header />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>

        {gaId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}');`}
            </Script>
          </>
        ) : null}
      </body>
    </html>
  );
}
