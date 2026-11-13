import { notFound } from "next/navigation";
import { OgPreviewGallery } from "../../components/og-preview-gallery";

export default function OgPreviewPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <OgPreviewGallery />;
}
