import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { SiteFooter } from "./components/site-footer";
import { SiteHeader } from "./components/site-header";

const siteUrl = "https://bluelizard.sbs";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Blue Lizard — Backend development, built with structure.", template: "%s — Blue Lizard" },
  description: "Blue Lizard is an actively developed toolkit for structured backend workflows, build tooling, security analysis, and AI-assisted development.",
  alternates: { canonical: siteUrl },
  openGraph: { type: "website", url: siteUrl, siteName: "Blue Lizard", title: "Blue Lizard — Backend development, built with structure.", description: "An actively developed toolkit for designing, validating, building, and serving backend applications." },
  twitter: { card: "summary", title: "Blue Lizard — Backend development, built with structure.", description: "An actively developed toolkit for structured backend workflows and AI-assisted development." },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><head><Script src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2976360252251832" strategy="beforeInteractive" crossOrigin="anonymous" /></head><body><div className="site-shell"><SiteHeader /><main className="site-main">{children}</main><SiteFooter /></div></body></html>;
}
