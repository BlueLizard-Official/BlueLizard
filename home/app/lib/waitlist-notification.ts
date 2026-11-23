import "server-only";

import type { WaitlistEntry } from "./waitlist-repository";

export async function notifyWaitlistTeam(entry: WaitlistEntry): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.WAITLIST_NOTIFICATION_FROM?.trim();
  const to = process.env.WAITLIST_NOTIFICATION_TO?.trim() || "contact@bluelizard.sbs";

  if (!apiKey || !from) {
    console.warn("[waitlist] Resend notifications are not configured");
    return;
  }

  const fields = [
    ["Name", entry.name],
    ["Email", entry.email],
    ["Development role", entry.role],
    ["GitHub", entry.githubUrl],
    ["Backend stack", entry.backendStack],
    ["Preferred AI agent", entry.preferredAgent],
    ["What they would build", entry.useCase],
    ["Submitted at", entry.createdAt],
  ];

  const request: RequestInit = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `bluelizard-waitlist/${entry.id}`,
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: "New BlueLizard waitlist submission",
      text: fields.filter(([, value]) => value).map(([label, value]) => `${label}: ${value}`).join("\n"),
    }),
  };

  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        ...request,
        signal: AbortSignal.timeout(4000),
      });

      if (response.ok) return;

      if (response.status < 500 || attempt === 2) {
        console.error("[waitlist] Resend notification failed", { status: response.status });
        return;
      }
    } catch {
      if (attempt === 2) {
        console.error("[waitlist] Resend notification request failed");
        return;
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 300));
  }
}
