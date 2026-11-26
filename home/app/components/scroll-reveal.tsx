"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;

        entry.target.setAttribute("data-revealed", "");
        observer.unobserve(entry.target);
      }
    }, { rootMargin: "0px 0px -12px 0px" });

    for (const target of document.querySelectorAll("[data-scroll-reveal], .site-main > section:not(.founders-section):not(.blueprint-hero)")) {
      if (!target.hasAttribute("data-revealed") && target.getBoundingClientRect().top >= window.innerHeight) observer.observe(target);
    }

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
