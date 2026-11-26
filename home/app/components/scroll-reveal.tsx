"use client";

import { useEffect } from "react";

export function ScrollReveal() {
  useEffect(() => {
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;

        entry.target.setAttribute("data-revealed", "");
        observer.unobserve(entry.target);
      }
    }, { rootMargin: "0px 0px -12px 0px" });

    for (const target of document.querySelectorAll("[data-scroll-reveal]")) {
      if (target.getBoundingClientRect().top >= window.innerHeight) observer.observe(target);
    }

    return () => observer.disconnect();
  }, []);

  return null;
}
