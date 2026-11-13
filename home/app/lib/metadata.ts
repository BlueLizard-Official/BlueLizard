import type { Metadata } from "next";

export const SITE_URL = "https://bluelizard.sbs";

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  image: string;
  imageAlt: string;
};

export function pageMetadata({ title, description, path, image, imageAlt }: PageMetadataInput): Metadata {
  const url = `${SITE_URL}${path}`;
  const imageUrl = `${SITE_URL}${image}`;
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
