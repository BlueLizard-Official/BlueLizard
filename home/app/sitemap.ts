import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://bluelizard.sbs";
  return ["", "/about", "/features", "/cli", "/mcp", "/roadmap", "/contact", "/privacy", "/terms"].map((path) => ({ url: `${base}${path}`, changeFrequency: "monthly", priority: path === "" ? 1 : 0.7 }));
}
