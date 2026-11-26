"use client";

import { useState } from "react";

const stages = [
  { title: "Define", detail: "Declare the endpoint, input schema, and services the request needs.", example: "POST /signup → SignupInput", href: "#blueprint", action: "Inspect the blueprint" },
  { title: "Connect", detail: "Make each handoff explicit so developers can follow data and permissions through the graph.", example: "Validation → Rate limit → Identity → Policy", href: "#blueprint", action: "Trace the request" },
  { title: "Build", detail: "See how a validated graph could map to the code and deployment files you own.", example: "Blueprint → NestJS → Docker Compose", href: "#build-output", action: "Explore build artifacts" },
];

export function WorkflowExplorer() {
  const [index, setIndex] = useState(0);
  const stage = stages[index];

  return (
    <>
      <div className="workflow-grid" role="group" aria-label="Blueprint workflow stages">
        {stages.map(({ title, detail }, i) => (
          <button type="button" className="workflow-card workflow-stage" aria-pressed={i === index} aria-controls="workflow-example" onClick={() => setIndex(i)} key={title}>
            <span className="workflow-card-top"><span>0{i + 1}</span><span className="workflow-card-line" /></span>
            <strong>{title}</strong>
            <span>{detail}</span>
          </button>
        ))}
      </div>
      <div id="workflow-example" className="workflow-example">
        <code key={stage.example} className="motion-swap" aria-live="polite">{stage.example}</code>
        <a className="text-link" href={stage.href}>{stage.action} <span aria-hidden="true">↗</span></a>
      </div>
    </>
  );
}
