import type { Metadata } from "next";

export const SITE_URL = "https://bluelizard.sbs";
export const OG_IMAGE_BASE_URL = "https://www.bluelizard.sbs";
export const MCP_PAGE_TITLE = "Your AI agent. Our blueprints.";
export const MCP_PAGE_DESCRIPTION = "Blue Lizard’s planned MCP direction lets compatible AI coding agents work through explicit backend blueprints instead of unstructured source-code generation.";
export const PRICING_PAGE_TITLE = "Blue Lizard Developer License";
export const PRICING_PAGE_DESCRIPTION = "Preview the planned Blue Lizard Developer License at ₹256 per month ahead of the December 3, 2026 MVP target.";

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
      siteName: "Blue Lizard",
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
  imageAlt: "Blue Lizard conceptual MCP workflow for structured backend blueprints.",
});

export const PRICING_PAGE_METADATA = pageMetadata({
  title: PRICING_PAGE_TITLE,
  description: PRICING_PAGE_DESCRIPTION,
  path: "/pricing",
  image: "/og/home.png",
  imageAlt: "Blue Lizard Developer License pricing preview.",
});
