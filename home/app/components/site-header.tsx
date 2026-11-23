"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [["Home", "/"], ["Blueprints", "/#blueprint"], ["Features", "/features"], ["MCP", "/mcp"], ["Pricing", "/pricing"], ["Roadmap", "/roadmap"]] as const;

function currentFor(pathname: string, href: string) {
  if (href.startsWith("/#")) return undefined;
  return (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`)) ? "page" : undefined;
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return <header className="site-header">
    <div className="container header-inner">
      <Link className="wordmark" href="/" aria-label="Blue Lizard home" onClick={close}><Image className="wordmark-logo" src="/logo.png" alt="" width={36} height={36} priority /><span>Blue Lizard</span></Link>
      <nav className="desktop-nav" aria-label="Primary navigation">
        {navItems.map(([label, href]) => <Link className="nav-link" href={href} key={href} aria-current={currentFor(pathname, href)}>{label}</Link>)}
        <Link className="nav-link" href="/about" aria-current={pathname === "/about" ? "page" : undefined}>About</Link>
        <Link className="button-primary header-cta" href="/waitlist">Join Waitlist</Link>
      </nav>
      <button className="mobile-menu-button" type="button" aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? "Close navigation menu" : "Open navigation menu"} onClick={() => setOpen((current) => !current)}><span className="menu-icon" aria-hidden="true" /></button>
    </div>
    {open ? <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation">
      {[...navItems, ["About", "/about"] as const, ["Contact", "/contact"] as const].map(([label, href]) => <Link href={href} key={href} onClick={close} aria-current={currentFor(pathname, href)}>{label}</Link>)}
      <Link className="button-primary" href="/waitlist" onClick={close}>Join Waitlist</Link>
    </nav> : null}
  </header>;
}
