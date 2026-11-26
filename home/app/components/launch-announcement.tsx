"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export function LaunchAnnouncement() {
  const pathname = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  const shown = useRef(false);

  function showAnnouncement() {
    const panel = dialog.current;
    if (!panel || panel.open) return;
    panel.showModal();
    shown.current = true;
    try {
      sessionStorage.setItem("bluelizard-launch-announcement", "seen");
    } catch {
      // The in-memory marker still prevents repeat prompts during navigation.
    }
  }

  useEffect(() => {
    const panel = dialog.current;
    if (pathname !== "/" || location.hash) return;
    const timer = window.setTimeout(() => {
      if (shown.current || location.hash || document.visibilityState !== "visible") return;
      try {
        if (sessionStorage.getItem("bluelizard-launch-announcement") === "seen") return;
      } catch {
        // Storage may be disabled.
      }
      showAnnouncement();
    }, 9000);
    return () => {
      window.clearTimeout(timer);
      panel?.close();
    };
  }, [pathname]);

  return (
    <>
      <div className="launch-banner">
        <strong>MVP launching soon</strong>
        <button type="button" aria-haspopup="dialog" onClick={showAnnouncement}>Get launch updates <span aria-hidden="true">↗</span></button>
      </div>
      <dialog ref={dialog} className="launch-dialog" aria-labelledby="launch-dialog-title" aria-describedby="launch-dialog-details">
        <form method="dialog"><button className="launch-dialog-close" type="submit" aria-label="Close launch announcement">×</button></form>
        <p className="blueprint-kicker">BlueLizard early access</p>
        <h2 id="launch-dialog-title">MVP launching soon</h2>
        <p id="launch-dialog-details">Join the waitlist for launch updates and early access to the visual backend workflow.</p>
        <Link className="button-primary" href="/waitlist" onClick={() => dialog.current?.close()}>Join the waitlist</Link>
      </dialog>
    </>
  );
}
