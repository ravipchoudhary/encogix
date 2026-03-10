import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.encogix.example"; // update for production

  const routes = [
    "",
    "/about",
    "/services",
    "/portfolio",
    "/blog",
    "/career",
    "/internship",
    "/contact",
    "/admin/login",
    "/admin/dashboard",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.8,
  }));
}

