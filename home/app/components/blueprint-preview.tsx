"use client";

import { useEffect, useState } from "react";
import { SignupBlueprintGraph, signupSteps } from "./signup-blueprint-graph";

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
    <section className="blueprint-preview" id="blueprint" data-scroll-reveal aria-labelledby="blueprint-preview-title">
      <div className="blueprint-preview-header">
        <div><p className="blueprint-kicker">Conceptual preview</p><h2 id="blueprint-preview-title">A backend you can inspect at a glance.</h2></div>
        <div className="blueprint-preview-tools"><button className="button-secondary" type="button" onClick={runTrace} disabled={traceStep >= 0 && traceStep < lastStep}>{traceStep === lastStep ? "Replay request" : "Run request on graph"}</button><p className="blueprint-preview-note">Select any node to inspect it.</p></div>
      </div>
      <div className="blueprint-workspace">
        <div className="blueprint-workspace-bar"><span className="workspace-title"><span className="workspace-status-dot" aria-hidden="true" /> signup.blueprint</span><span className="workspace-meta">8 nodes · 7 connections · draft</span></div>
        <div className="blueprint-grid-surface">
          <SignupBlueprintGraph content={nodeContent} selectedId={activeId} onSelect={selectNode} traceStep={traceStep} />
        </div>
        <div className="blueprint-workspace-footer"><span><i className="legend-line legend-line-blue" aria-hidden="true" /> primary flow</span><span><i className="legend-line legend-line-orange" aria-hidden="true" /> infrastructure dependency</span><span className="workspace-footer-note">Illustrative graph, not the live editor</span></div>
      </div>
      <aside className="blueprint-inspector" aria-live="polite" aria-label="Selected blueprint node details">
        <div className="inspector-heading"><span className="blueprint-kicker">Selected node</span><span className="inspector-node-count">{selectedNode.category}</span></div>
        <div key={activeId} className="inspector-content motion-swap"><h3>{selectedNode.title}</h3><p>{selectedNode.purpose}</p><dl><div><dt>Configuration</dt><dd>{selectedNode.configuration}</dd></div><div><dt>Inputs</dt><dd>{selectedNode.inputs.map((socket) => socket.label).join(" · ")}</dd></div><div><dt>Outputs</dt><dd>{selectedNode.outputs.map((socket) => socket.label).join(" · ")}</dd></div></dl></div>
      </aside>
    </section>
  );
}
