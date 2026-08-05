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
    "/hire-developers",
    "/hire-developers/react-developer",
    "/hire-developers/nextjs-developer",
    "/hire-developers/nodejs-developer",
    "/hire-developers/flutter-developer",
    "/hire-developers/python-developer",
    "/hire-developers/ai-ml-engineer",
    "/hire-developers/full-stack-developer",
    "/ai-machine-learning",
    "/data-analytics",
    "/cloud-transformation",
    "/agile-devops",
    "/product-engineering",
    "/security-compliance",
    "/why-encogix",
    "/development-process",
    "/technologies",
    "/industries",
    "/portfolio",
    "/case-studies",
    "/pricing",
    "/blog",
    "/career",
    "/internship",
    "/contact",
    "/privacy-policy",
    "/terms",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route.startsWith("/services") ? 0.9 : 0.8,
  }));
}
