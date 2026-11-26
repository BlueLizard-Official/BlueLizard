"use client";

import { useEffect, useState } from "react";
import { signupSteps } from "./signup-blueprint-graph";

const nodeContent = {
  request: {
    title: "HTTP POST /signup",
    category: "Endpoint",
    categoryTone: "blue" as const,
    description: "Accept a new account request",
    purpose: "Defines the public entry point and the contract an incoming request must satisfy.",
    configuration: "POST /signup · JSON body · 201 / 400 / 429",
    inputs: [{ label: "request", type: "request" as const }],
    outputs: [{ label: "payload", type: "data" as const }],
  },
  validation: {
    title: "Input Validation",
    category: "Guard",
    categoryTone: "orange" as const,
    description: "Check shape, format, and intent",
    purpose: "Makes the boundary explicit before any identity or persistence work begins.",
    configuration: "schema: SignupInput · reject unknown fields",
    inputs: [{ label: "payload", type: "data" as const }],
    outputs: [{ label: "validated payload", type: "data" as const }],
  },
  authentication: {
    title: "Authentication",
    category: "Identity",
    categoryTone: "blue" as const,
    description: "Create or resolve an identity",
    purpose: "Separates identity decisions from the transport layer and prepares a principal for policy evaluation.",
    configuration: "provider: email · session: pending",
    inputs: [{ label: "allowed payload", type: "data" as const }],
    outputs: [{ label: "principal", type: "policy" as const }],
  },
  policy: {
    title: "OpenFGA Policy",
    category: "Authorization",
    categoryTone: "orange" as const,
    description: "Evaluate access before mutation",
    purpose: "Creates a visible policy checkpoint where relationship-based permissions can be inspected.",
    configuration: "check: user → workspace · deny by default",
    inputs: [{ label: "principal", type: "policy" as const }],
    outputs: [{ label: "allowed", type: "policy" as const }],
  },
  database: {
    title: "Database Query",
    category: "Persistence",
    categoryTone: "green" as const,
    description: "Write the durable account record",
    purpose: "Connects the approved request to persistent storage with an explicit data boundary.",
    configuration: "PostgreSQL · transaction: signup · returning: user",
    inputs: [{ label: "allowed", type: "policy" as const }],
    outputs: [{ label: "user", type: "data" as const }],
  },
  response: {
    title: "Return Response",
    category: "Output",
    categoryTone: "slate" as const,
    description: "Return a typed success envelope",
    purpose: "Makes the final response a deliberate part of the backend blueprint rather than an afterthought.",
    configuration: "status: 201 · body: UserCreated · headers: safe",
    inputs: [{ label: "user", type: "data" as const }],
    outputs: [{ label: "response", type: "response" as const }],
  },
  redis: {
    title: "Rate Limit",
    category: "Cache",
    categoryTone: "orange" as const,
    description: "Throttle repeated signup attempts",
    purpose: "Rejects requests over the limit with HTTP 429 before identity or database work begins.",
    configuration: "Redis · key: ip + email · window: 60s",
    inputs: [{ label: "validated payload", type: "data" as const }],
    outputs: [{ label: "allowed payload", type: "data" as const }],
  },
  postgres: {
    title: "PostgreSQL",
    category: "Storage",
    categoryTone: "green" as const,
    description: "Persistent system of record",
    purpose: "Names the durable service behind the query node so infrastructure dependencies remain visible.",
    configuration: "cluster: primary · schema: accounts",
    inputs: [{ label: "query", type: "data" as const }],
    outputs: [{ label: "record", type: "data" as const }],
  },
} as const;

export function BlueprintPreview() {
  const [selectedId, setSelectedId] = useState("request");
  const [traceStep, setTraceStep] = useState(-1);
  const lastStep = signupSteps.length - 1;
  const activeId = traceStep < 0 ? selectedId : signupSteps[traceStep];
  const selectedNode = nodeContent[activeId as keyof typeof nodeContent];

  useEffect(() => {
    if (traceStep < 0 || traceStep >= lastStep) return;
    const timer = window.setTimeout(() => setTraceStep(traceStep + 1), 520);
    return () => window.clearTimeout(timer);
  }, [traceStep, lastStep]);

  function runTrace() {
    setTraceStep(window.matchMedia("(prefers-reduced-motion: reduce)").matches ? lastStep : 0);
  }

  function selectNode(id: string) {
    setTraceStep(-1);
    setSelectedId(id);
  }

  return (
    <section className="blueprint-explorer" id="blueprint" data-scroll-reveal aria-labelledby="blueprint-preview-title">
      <div className="blueprint-explorer-heading">
        <p className="blueprint-kicker">Interactive blueprint</p>
        <h2 id="blueprint-preview-title">Explore the signup flow.</h2>
        <p>Follow a sample request or select any step to see what it does.</p>
      </div>

      <div className="blueprint-explorer-shell">
        <div className="blueprint-explorer-toolbar">
          <span className="workspace-title"><span className="workspace-status-dot" aria-hidden="true" /> signup.blueprint</span>
          <button className="button-primary" type="button" onClick={runTrace} disabled={traceStep >= 0 && traceStep < lastStep}>
            {traceStep === lastStep ? "Replay request" : traceStep < 0 ? "Run sample request" : "Tracing request…"}
          </button>
        </div>
        <div className="blueprint-explorer-body">
          <div className="blueprint-explorer-canvas">
            <ol className="blueprint-explorer-steps" aria-label="Signup request steps">
              {signupSteps.map((id, index) => (
                <li key={id}>
                  <button type="button" aria-pressed={id === activeId} data-traced={index <= traceStep} onClick={() => selectNode(id)}>
                    <span className="blueprint-explorer-step-label"><span>{String(index + 1).padStart(2, "0")}</span>{nodeContent[id].category}</span>
                    <strong>{nodeContent[id].title}</strong>
                    <span className="blueprint-explorer-description">{nodeContent[id].description}</span>
                  </button>
                </li>
              ))}
            </ol>
            <button type="button" className="blueprint-explorer-storage" aria-pressed={activeId === "postgres"} onClick={() => selectNode("postgres")}>
              <span className="blueprint-explorer-step-label">Database dependency</span>
              <strong>PostgreSQL</strong>
            </button>
          </div>
          <aside className="blueprint-explorer-inspector" aria-label="Selected blueprint node details">
            <p className="blueprint-kicker">{selectedNode.category}</p>
            <div key={activeId} className="motion-swap">
              <h3>{selectedNode.title}</h3>
              <p>{selectedNode.purpose}</p>
              <dl>
                <div><dt>Configuration</dt><dd>{selectedNode.configuration}</dd></div>
                <div><dt>Inputs</dt><dd>{selectedNode.inputs.map(({ label }) => label).join(" · ")}</dd></div>
                <div><dt>Outputs</dt><dd>{selectedNode.outputs.map(({ label }) => label).join(" · ")}</dd></div>
              </dl>
            </div>
          </aside>
        </div>
        <div className="blueprint-explorer-footer">
          <span>Illustrative backend</span>
          <span role="status">{traceStep === lastStep ? "201 Created · Sample request complete" : traceStep >= 0 ? `Tracing step ${traceStep + 1} of ${signupSteps.length}` : ""}</span>
        </div>
      </div>
    </section>
  );
}
