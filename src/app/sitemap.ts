import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://chigolite.vercel.app";
  const pages = ["", "portfolio"];

  return pages.map((path) => ({
    url: `${baseUrl}/${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1.0 : 0.8,
  }));
}