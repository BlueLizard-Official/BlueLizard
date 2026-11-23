"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const OG_IMAGE_BASE_URL = "https://www.bluelizard.sbs";

const ogImages = [
  { name: "Homepage", path: "/", file: "home.png", src: "/og/home.png", title: "Backend development, built with structure.", description: "Structured workflows for designing, validating, building, and serving backend applications." },
  { name: "About", path: "/about", file: "about.png", src: "/og/about.png", title: "Engineering with structure.", description: "A systematic approach to backend development." },
  { name: "Features", path: "/features", file: "features.png", src: "/og/features.png", title: "Tools for structured backend development.", description: "Blueprints. Validation. Build workflows." },
  { name: "CLI", path: "/cli", file: "cli.png", src: "/og/cli.png", title: "BlueLizard CLI", description: "Build and serve through a consistent workflow." },
  { name: "MCP", path: "/mcp", file: "mcp.png", src: "/og/mcp.png", title: "BlueLizard MCP", description: "Structured tooling for AI coding agents." },
  { name: "Roadmap", path: "/roadmap", file: "roadmap.png", src: "/og/roadmap.png", title: "Building BlueLizard.", description: "An evolving developer tooling platform." },
  { name: "Contact", path: "/contact", file: "contact.png", src: "/og/contact.png", title: "Let's talk engineering.", description: "Questions, feedback, and technical inquiries." },
  { name: "Privacy", path: "/privacy", file: "privacy.png", src: "/og/privacy.png", title: "Privacy", description: "Information about data and privacy practices." },
  { name: "Terms", path: "/terms", file: "terms.png", src: "/og/terms.png", title: "Terms of Use", description: "Information about using BlueLizard." },
] as const;

type PreviewMode = "full" | "social" | "small";

export function OgPreviewGallery() {
  const [selected, setSelected] = useState<(typeof ogImages)[number] | null>(null);
  const [mode, setMode] = useState<PreviewMode>("full");
  const [copied, setCopied] = useState("");

  useEffect(() => {
    if (!selected) return;
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") setSelected(null); };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selected]);

  function openPreview(item: (typeof ogImages)[number]) {
    setSelected(item);
    setMode("full");
  }

  async function copyUrl(item: (typeof ogImages)[number]) {
    const url = `${OG_IMAGE_BASE_URL}${item.src}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(item.file);
      window.setTimeout(() => setCopied(""), 1800);
    } catch { setCopied(""); }
  }

  return <main className="og-gallery-page"><section className="page-intro"><div className="container"><p className="eyebrow">Development tool / OG image system</p><h1>Open Graph image gallery</h1><p>Local previews for the nine page-specific images used by BlueLizard social metadata.</p></div></section><section className="section"><div className="container"><div className="og-gallery-grid">{ogImages.map((item) => <article className="og-gallery-card" key={item.file}><Image className="og-card-image" src={item.src} alt={`${item.name} Open Graph preview`} width={1200} height={630} /><div className="og-card-body"><div><p className="eyebrow">{item.name}</p><h2>{item.title}</h2><p className="og-card-description">{item.description}</p></div><dl className="og-card-meta"><div><dt>Route</dt><dd>{item.path}</dd></div><div><dt>Size</dt><dd>1200 × 630 PNG</dd></div><div><dt>File</dt><dd>{item.file}</dd></div></dl><div className="og-card-actions"><button className="button-primary" type="button" onClick={() => openPreview(item)}>Preview</button><button className="button-secondary" type="button" onClick={() => copyUrl(item)}>{copied === item.file ? "Copied" : "Copy image URL"}</button></div></div></article>)}</div></div></section>{selected ? <div className="og-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}><div className="og-modal" role="dialog" aria-modal="true" aria-labelledby="og-modal-title"><div className="og-modal-header"><div><p className="eyebrow">{selected.name} / {selected.file}</p><h2 id="og-modal-title">{selected.title}</h2></div><button className="button-secondary" type="button" onClick={() => setSelected(null)}>Close</button></div><div className="og-mode-tabs" role="tablist" aria-label="Preview modes"><button className={mode === "full" ? "og-mode-tab active" : "og-mode-tab"} type="button" role="tab" aria-selected={mode === "full"} onClick={() => setMode("full")}>Full size</button><button className={mode === "social" ? "og-mode-tab active" : "og-mode-tab"} type="button" role="tab" aria-selected={mode === "social"} onClick={() => setMode("social")}>Social card</button><button className={mode === "small" ? "og-mode-tab active" : "og-mode-tab"} type="button" role="tab" aria-selected={mode === "small"} onClick={() => setMode("small")}>Small readability</button></div>{mode === "full" ? <div className="og-full-preview"><Image src={selected.src} alt={`${selected.name} full-size Open Graph image`} width={1200} height={630} /></div> : null}{mode === "social" ? <div className="og-social-preview"><Image src={selected.src} alt={`${selected.name} social card simulation`} width={1200} height={630} /><div className="og-social-copy"><span>{OG_IMAGE_BASE_URL.replace("https://", "")}</span><strong>{selected.title}</strong><p>{selected.description}</p></div></div> : null}{mode === "small" ? <div className="og-small-preview"><div><p className="eyebrow">600 × 315</p><Image src={selected.src} alt={`${selected.name} at 600 by 315`} width={600} height={315} /></div><div><p className="eyebrow">300 × 158</p><Image src={selected.src} alt={`${selected.name} at 300 by 158`} width={300} height={158} /></div></div> : null}</div></div> : null}</main>;
}
