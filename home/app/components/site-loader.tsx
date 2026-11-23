"use client";

import { useEffect, useRef } from "react";

export function SiteLoader() {
  const loader = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loader.current?.setAttribute("data-ready", "true");
  }, []);

  return (
    <div className="site-loader" ref={loader} role="status">
      <span className="site-loader-mascot" aria-hidden="true" />
      <span>Loading BlueLizard…</span>
    </div>
  );
}
