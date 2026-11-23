import type { MetadataRoute } from "next";
import { SITE_URL } from "./lib/metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/about", "/features", "/cli", "/mcp", "/pricing", "/roadmap", "/contact", "/waitlist", "/privacy", "/terms"].map((path) => ({ url: `${SITE_URL}${path}`, changeFrequency: "monthly", priority: path === "" ? 1 : 0.7 }));
}
