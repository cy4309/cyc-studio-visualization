import type { MetadataRoute } from "next";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://cyc-studio-visualization.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const root = baseUrl.replace(/\/$/, "");
  const now = new Date();
  return [
    {
      url: `${root}/zh`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 1,
    },
    {
      url: `${root}/en`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 1,
    },
  ];
}
