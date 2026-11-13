import type { MetadataRoute } from "next";
import { profile } from "@/lib/site-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = profile.siteUrl.replace(/\/$/, "");
  return [
    { url: `${baseUrl}/`, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${baseUrl}/ask`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];
}
