import Link from "next/link";
import Image from "next/image";
import { CurrentYear } from "./current-year";

export function SiteFooter() {
  return <footer className="site-footer"><div className="container"><div className="footer-grid">
    <div className="footer-brand"><Link className="wordmark" href="/"><Image className="wordmark-logo" src="/logo.png" alt="" width={36} height={36} /><span>Blue Lizard</span></Link><p>Structured tooling for backend development.</p></div>
    <div className="footer-column"><h2>Product</h2><div className="footer-links"><Link href="/features">Features</Link><Link href="/cli">CLI</Link><Link href="/mcp">MCP</Link><Link href="/roadmap">Roadmap</Link></div></div>
    <div className="footer-column"><h2>Project</h2><div className="footer-links"><Link href="/about">About</Link><Link href="/contact">Contact</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div></div>
    <div className="footer-column"><h2>Reach out</h2><div className="footer-links"><a href="mailto:contact@bluelizard.sbs">contact@bluelizard.sbs</a><span>Under active development</span></div></div>
  </div><div className="footer-bottom"><span>© <CurrentYear /> Blue Lizard</span><span>Interfaces and implementation details may change as the project evolves.</span></div></div></footer>;
}
