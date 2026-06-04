import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.encogix.com";

  const routes = [
    "",
    "/about",
    "/services",
    "/services/website-development",
    "/services/ecommerce-development",
    "/services/mobile-app-development",
    "/services/crm-development",
    "/services/ai-solutions",
    "/services/seo-services",
    "/portfolio",
    "/case-studies",
    "/pricing",
    "/blog",
    "/career",
    "/internship",
    "/contact",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route.startsWith("/services") ? 0.9 : 0.8,
  }));
}
