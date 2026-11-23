"use client";

import { useState } from "react";
import { SignupBlueprintGraph } from "./signup-blueprint-graph";

const nodeContent = {
  request: {
    title: "HTTP POST /signup",
    category: "Endpoint",
    categoryTone: "blue" as const,
    description: "Accept a registration request",
    purpose: "The agent proposed a public entry point with a typed request boundary for the waitlist example.",
    configuration: "POST /signup · JSON body · 201 / 400 / 429",
    inputs: [{ label: "request", type: "request" as const }],
    outputs: [{ label: "payload", type: "data" as const }],
  },
  validation: {
    title: "Input Validation",
    category: "Guard",
    categoryTone: "orange" as const,
    description: "Check shape and format",
    purpose: "Validation makes the request contract visible before identity, policy, or storage work begins.",
    configuration: "schema: SignupInput · reject unknown fields",
    inputs: [{ label: "payload", type: "data" as const }],
    outputs: [{ label: "validated payload", type: "data" as const }],
  },
  authentication: {
    title: "Authentication",
    category: "Identity",
    categoryTone: "blue" as const,
    description: "Resolve a principal",
    purpose: "Identity is separated from transport so an agent or developer can inspect where a principal enters the flow.",
    configuration: "provider: email · session: pending",
    inputs: [{ label: "allowed payload", type: "data" as const }],
    outputs: [{ label: "principal", type: "policy" as const }],
  },
  policy: {
    title: "OpenFGA Policy",
    category: "Authorization",
    categoryTone: "orange" as const,
    description: "Evaluate access before mutation",
    purpose: "Authorization is a visible checkpoint rather than an implicit condition hidden in generated source code.",
    configuration: "check: user → workspace · deny by default",
    inputs: [{ label: "principal", type: "policy" as const }],
    outputs: [{ label: "allowed", type: "policy" as const }],
  },
  database: {
    title: "Database Query",
    category: "Persistence",
    categoryTone: "green" as const,
    description: "Write durable account data",
    purpose: "The graph names the persistent data boundary and keeps the storage operation inspectable.",
    configuration: "PostgreSQL · transaction: signup · returning: user",
    inputs: [{ label: "allowed", type: "policy" as const }],
    outputs: [{ label: "user", type: "data" as const }],
  },
  response: {
    title: "Return Response",
    category: "Output",
    categoryTone: "slate" as const,
    description: "Return a typed envelope",
    purpose: "The response is part of the declared backend shape and can be validated alongside the request path.",
    configuration: "status: 201 · body: UserCreated · headers: safe",
    inputs: [{ label: "user", type: "data" as const }],
    outputs: [{ label: "response", type: "response" as const }],
  },
  redis: {
    title: "Rate Limit",
    category: "Cache",
    categoryTone: "orange" as const,
    description: "Throttle repeated requests",
    purpose: "Uses Redis to enforce the limit before identity resolution. Requests over the limit return HTTP 429.",
    configuration: "Redis · key: email · window: 60s",
    inputs: [{ label: "validated payload", type: "data" as const }],
    outputs: [{ label: "allowed payload", type: "data" as const }],
  },
  postgres: {
    title: "PostgreSQL",
    category: "Storage",
    categoryTone: "green" as const,
    description: "Persistent system of record",
    purpose: "The infrastructure dependency is represented as a named node so storage choices remain reviewable.",
    configuration: "cluster: primary · schema: accounts",
    inputs: [{ label: "query", type: "data" as const }],
    outputs: [{ label: "record", type: "data" as const }],
  },
} as const;

const workflowStages = [
  ["prompt", "Developer prompt", "A human describes the backend outcome and constraints."],
  ["agent", "MCP-compatible AI agent", "The agent proposes a structured change instead of a code dump."],
  ["server", "BlueLizard MCP Server", "A planned protocol boundary would expose bounded blueprint operations."],
  ["tools", "Blueprint tools / graph definitions", "Nodes, connections, and configuration become explicit project context."],
  ["checks", "Validation and security checks", "The graph can be checked for structure, policy, and dependency violations."],
  ["output", "Backend build output", "A validated blueprint becomes input to the intended build workflow."],
] as const;

export function MCPWorkflow() {
  const [selectedId, setSelectedId] = useState("request");
  const [selectedStage, setSelectedStage] = useState<(typeof workflowStages)[number][0]>("prompt");
  const selectedNode = nodeContent[selectedId as keyof typeof nodeContent];

  return (
    <div className="mcp-workflow">
      <div className="mcp-prompt-card">
        <div>
          <span className="blueprint-kicker">Hypothetical developer prompt</span>
          <p>“Create a user registration API with validation, PostgreSQL storage, authorization checks and Redis-backed rate limiting.”</p>
        </div>
        <span className="mcp-concept-label">Illustrative workflow</span>
      </div>

      <div className="mcp-stage-flow" aria-label="Conceptual MCP workflow">
        {workflowStages.map(([id, title, description], index) => (
          <div className="mcp-stage-item" key={id}>
            <button className={`mcp-stage-button${selectedStage === id ? " is-selected" : ""}`} type="button" aria-pressed={selectedStage === id} onClick={() => setSelectedStage(id)}>
              <span className="mcp-stage-number">0{index + 1}</span>
              <span><strong>{title}</strong><small>{description}</small></span>
            </button>
            {index < workflowStages.length - 1 ? <span className="mcp-stage-arrow" aria-hidden="true">↓</span> : null}
          </div>
        ))}
      </div>

      <div className="mcp-agent-response">
        <div className="mcp-agent-response-header">
          <div><span className="blueprint-kicker">Example agent response</span><h3>signup.blueprint</h3></div>
          <span className="mcp-concept-label">Conceptual preview</span>
        </div>
        <div className="mcp-graph-surface">
          <SignupBlueprintGraph content={nodeContent} selectedId={selectedId} onSelect={setSelectedId} />
        </div>
        <div className="mcp-graph-legend"><span><i className="legend-line legend-line-blue" aria-hidden="true" /> typed data flow</span><span><i className="legend-line legend-line-orange" aria-hidden="true" /> infrastructure dependency</span><span>8 nodes · 7 connections</span></div>
      </div>

      <aside className="mcp-node-inspector" aria-live="polite" aria-label="Selected agent response node details">
        <div className="inspector-heading"><span className="blueprint-kicker">Selected node</span><span className="inspector-node-count">{selectedNode.category}</span></div>
        <div className="inspector-content"><h3>{selectedNode.title}</h3><p>{selectedNode.purpose}</p><dl><div><dt>Configuration</dt><dd>{selectedNode.configuration}</dd></div><div><dt>Inputs</dt><dd>{selectedNode.inputs.map((socket) => `${socket.label} (${socket.type})`).join(" · ")}</dd></div><div><dt>Outputs</dt><dd>{selectedNode.outputs.map((socket) => `${socket.label} (${socket.type})`).join(" · ")}</dd></div></dl></div>
      </aside>

      <p className="mcp-selected-stage" aria-live="polite"><span>Selected workflow step:</span> {workflowStages.find(([id]) => id === selectedStage)?.[1]}</p>
    </div>
  );
}
