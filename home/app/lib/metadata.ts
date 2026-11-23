import type { Metadata } from "next";

export const SITE_URL = "https://bluelizard.sbs";
export const OG_IMAGE_BASE_URL = "https://www.bluelizard.sbs";
export const SITE_TITLE = "BlueLizard | Visual Backends for AI Agents";
export const SITE_DESCRIPTION = "Design backends with visual blueprints, connect AI coding agents through MCP, and generate deployable backend projects. Join the BlueLizard MVP waitlist.";
export const MCP_PAGE_TITLE = "Your AI agent. Our blueprints.";
export const MCP_PAGE_DESCRIPTION = "BlueLizard’s planned MCP direction lets compatible AI coding agents work through explicit backend blueprints instead of unstructured source-code generation.";
export const PRICING_PAGE_TITLE = "BlueLizard Developer License";
export const PRICING_PAGE_DESCRIPTION = "Discuss BlueLizard Developer License pricing and project requirements with the team.";

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  image: string;
  imageAlt: string;
};

export function pageMetadata({ title, description, path, image, imageAlt }: PageMetadataInput): Metadata {
  const url = `${SITE_URL}${path}`;
  const imageUrl = `${OG_IMAGE_BASE_URL}${image}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      siteName: "BlueLizard",
      title,
      description,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export const MCP_PAGE_METADATA = pageMetadata({
  title: MCP_PAGE_TITLE,
  description: MCP_PAGE_DESCRIPTION,
  path: "/mcp",
  image: "/og/mcp.png",
  imageAlt: "BlueLizard conceptual MCP workflow for structured backend blueprints.",
});

export const PRICING_PAGE_METADATA = pageMetadata({
  title: PRICING_PAGE_TITLE,
  description: PRICING_PAGE_DESCRIPTION,
  path: "/pricing",
  image: "/og/home.png",
  imageAlt: "BlueLizard Developer License pricing by consultation.",
});
