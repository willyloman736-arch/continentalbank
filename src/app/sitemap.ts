import type { MetadataRoute } from "next";

const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000");

const publicRoutes = [
  "/",
  "/about",
  "/leadership",
  "/services",
  "/offices",
  "/insights",
  "/security",
  "/compliance",
  "/fraud-protection",
  "/help",
  "/faq",
  "/refund",
  "/privacy",
  "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return publicRoutes.map((route) => ({
    url: `${siteUrl.origin}${route}`,
    lastModified,
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.7,
  }));
}
