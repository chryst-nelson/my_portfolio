import type React from "react";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import localFont from "next/font/local";
import "@fontsource-variable/schibsted-grotesk";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ChatProvider } from "@/lib/chat/ChatProvider";
import { profile, socials } from "@/lib/site-data";

// Self-hosted (SIL OFL) so builds and CI never depend on Google Fonts.
const geistMono = localFont({
  src: "../fonts/GeistMono-Variable.woff2",
  weight: "100 900",
  variable: "--font-geist-mono",
  display: "swap",
});

const title = `${profile.name} — ${profile.role}`;
const description = `${profile.positioning}. React, Next.js and Tailwind on the front, Node and Spring Boot behind it, shipped with Docker and GitHub Actions.`;

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title,
  description,
  keywords: [
    "Frontend Engineer",
    "Full Stack Developer",
    "DevOps",
    "React",
    "Next.js",
    "Tailwind CSS",
    "React Native",
    "Spring Boot",
    "Docker",
    "GitHub Actions",
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
    { media: "(prefers-color-scheme: light)", color: "#f2f0ea" },
    { media: "(prefers-color-scheme: dark)", color: "#0e1013" },
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
    "Docker",
    "GitHub Actions",
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
    <html lang="en" className={geistMono.variable} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body>
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="light"
          themes={["light", "dark"]}
          enableSystem={false}
        >
          <ChatProvider>{children}</ChatProvider>
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
