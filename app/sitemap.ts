import { MetadataRoute } from "next";
import { db } from "../lib/mysql";
import { slugifyTitle } from "../lib/slug";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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
    "/pricing",
    "/blog",
    "/career",
    "/internship",
    "/contact",
    "/testimonial",
    "/certificate-verification",
    "/privacy-policy",
    "/terms",
  ];

  const entries = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route.startsWith("/services") ? 0.9 : 0.8,
  })) as MetadataRoute.Sitemap;

  try {
    const [projects, blogs] = await Promise.all([
      db.project.findMany({ orderBy: { id: "desc" } }),
      db.blog.findMany({ orderBy: { createdAt: "desc" } }),
    ]);
    entries.push(...(projects as { slug: string | null }[]).filter((project) => project.slug).map((project) => ({
      url: `${baseUrl}/portfolio/${project.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })));
    entries.push(...(blogs as { id: number; title: string | null; createdAt: Date | null }[]).map((blog) => ({
      url: `${baseUrl}/blog/${slugifyTitle(blog.title || `blog-${blog.id}`)}`,
      lastModified: blog.createdAt ? new Date(blog.createdAt) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })));
  } catch {}

  return entries;
}
