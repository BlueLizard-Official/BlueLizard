import Link from "next/link";
import Image from "next/image";
import { PHONE_DISPLAY, PHONE_HREF } from "../lib/contact";
import { CurrentYear } from "./current-year";

export function SiteFooter() {
  return <footer className="site-footer"><div className="container"><div className="footer-grid">
    <div className="footer-brand"><Link className="wordmark" href="/"><Image className="wordmark-logo" src="/logo.png" alt="" width={36} height={36} /><span>BlueLizard</span></Link><p>Visual blueprints for backend systems.</p></div>
    <div className="footer-column"><h2>Product</h2><div className="footer-links"><Link href="/#blueprint">Blueprints</Link><Link href="/features">Features</Link><Link href="/mcp">MCP</Link><Link href="/pricing">Pricing</Link></div></div>
    <div className="footer-column"><h2>Project</h2><div className="footer-links"><Link href="/about">About</Link><Link href="/contact">Contact</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div></div>
    <div className="footer-column"><h2>Reach out</h2><div className="footer-links"><Link href="/waitlist">Join the waitlist</Link><a href="mailto:contact@bluelizard.sbs">contact@bluelizard.sbs</a><a href={PHONE_HREF}>{PHONE_DISPLAY}</a><span>MVP target: December 3, 2026</span></div></div>
  </div><div className="footer-bottom"><span>© <CurrentYear /> BlueLizard</span><span>Interfaces and implementation details may change as the project evolves.</span></div></div></footer>;
}
