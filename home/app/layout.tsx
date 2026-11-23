import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { SiteFooter } from "./components/site-footer";
import { SiteHeader } from "./components/site-header";
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "./lib/metadata";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: "%s | Blue Lizard" },
  description: SITE_DESCRIPTION,
  alternates: { canonical: SITE_URL },
  openGraph: { type: "website", url: SITE_URL, siteName: "Blue Lizard", title: SITE_TITLE, description: SITE_DESCRIPTION, images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "Blue Lizard visual backend blueprints for AI agents." }] },
  twitter: { card: "summary_large_image", title: SITE_TITLE, description: SITE_DESCRIPTION, images: ["/og/home.png"] },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en">
    <head>
      <Script src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2976360252251832" strategy="afterInteractive" crossOrigin="anonymous"></Script>
      </head>
      <body>
        <div className="site-shell"><SiteHeader /><main className="site-main">{children}</main><SiteFooter /></div></body>
    </html>;
}
