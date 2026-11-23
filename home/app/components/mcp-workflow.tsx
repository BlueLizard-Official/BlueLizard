"use client";

import { useMemo, useState } from "react";
import { BlueprintConnection, type BlueprintPoint } from "./blueprint-connection";
import { BlueprintNode, type BlueprintNodeData, type BlueprintNodePosition } from "./blueprint-node";

type ConnectionSide = "top" | "right" | "bottom" | "left";

type ConnectionDefinition = {
  readonly from: string;
  readonly to: string;
  readonly fromSide: ConnectionSide;
  readonly toSide: ConnectionSide;
  readonly tone: "blue" | "orange" | "neutral";
};

type GraphLayout = {
  readonly height: number;
  readonly nodes: readonly BlueprintNodeData[];
  readonly connections: readonly ConnectionDefinition[];
};

const nodeContent = {
  request: {
    title: "HTTP POST /signup",
    category: "Endpoint",
    categoryTone: "blue" as const,
    description: "Accept a registration request",
    purpose: "The agent proposed a public entry point with a typed request boundary for the waitlist example.",
    configuration: "POST /signup · JSON body · 201 / 400",
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
    outputs: [
      { label: "valid", type: "data" as const },
      { label: "limit", type: "cache" as const },
    ],
  },
  authentication: {
    title: "Authentication",
    category: "Identity",
    categoryTone: "blue" as const,
    description: "Resolve a principal",
    purpose: "Identity is separated from transport so an agent or developer can inspect where a principal enters the flow.",
    configuration: "provider: email · session: pending",
    inputs: [{ label: "valid", type: "data" as const }],
    outputs: [{ label: "principal", type: "data" as const }],
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
    inputs: [{ label: "allowed", type: "data" as const }],
    outputs: [{ label: "user", type: "data" as const }],
  },
  response: {
    title: "Return Response",
    category: "Output",
    categoryTone: "slate" as const,
    description: "Return a typed envelope",
    purpose: "The response is part of the declared backend shape and can be validated alongside the request path.",
    configuration: "status: 201 · body: UserCreated · headers: safe",
    inputs: [{ label: "user", type: "response" as const }],
    outputs: [{ label: "response", type: "response" as const }],
  },
  redis: {
    title: "Rate Limit",
    category: "Cache",
    categoryTone: "orange" as const,
    description: "Throttle repeated requests",
    purpose: "The side branch makes the Redis dependency explicit without hiding it inside generated implementation details.",
    configuration: "Redis · key: email · window: 60s",
    inputs: [{ label: "limit", type: "cache" as const }],
    outputs: [{ label: "allowed", type: "cache" as const }],
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

function makeNode(id: keyof typeof nodeContent, position: BlueprintNodePosition): BlueprintNodeData {
  return { id, ...nodeContent[id], position };
}

const desktopLayout: GraphLayout = {
  height: 86,
  nodes: [
    makeNode("request", { x: 35, y: 4, width: 30, height: 9 }),
    makeNode("validation", { x: 35, y: 18, width: 30, height: 9 }),
    makeNode("authentication", { x: 35, y: 32, width: 30, height: 9 }),
    makeNode("policy", { x: 35, y: 46, width: 30, height: 9 }),
    makeNode("database", { x: 35, y: 60, width: 30, height: 9 }),
    makeNode("response", { x: 35, y: 74, width: 30, height: 9 }),
    makeNode("redis", { x: 2, y: 29, width: 27, height: 10 }),
    makeNode("postgres", { x: 71, y: 57, width: 27, height: 10 }),
  ],
  connections: [
    { from: "request", to: "validation", fromSide: "bottom", toSide: "top", tone: "blue" },
    { from: "validation", to: "authentication", fromSide: "bottom", toSide: "top", tone: "neutral" },
    { from: "authentication", to: "policy", fromSide: "bottom", toSide: "top", tone: "blue" },
    { from: "policy", to: "database", fromSide: "bottom", toSide: "top", tone: "neutral" },
    { from: "database", to: "response", fromSide: "bottom", toSide: "top", tone: "blue" },
    { from: "validation", to: "redis", fromSide: "left", toSide: "right", tone: "orange" },
    { from: "database", to: "postgres", fromSide: "right", toSide: "left", tone: "orange" },
  ],
};

const mobileLayout: GraphLayout = {
  height: 136,
  nodes: [
    makeNode("request", { x: 14, y: 3, width: 72, height: 9 }),
    makeNode("validation", { x: 14, y: 19, width: 72, height: 9 }),
    makeNode("authentication", { x: 14, y: 35, width: 72, height: 9 }),
    makeNode("policy", { x: 14, y: 51, width: 72, height: 9 }),
    makeNode("database", { x: 14, y: 67, width: 72, height: 9 }),
    makeNode("response", { x: 14, y: 83, width: 72, height: 9 }),
    makeNode("redis", { x: 4, y: 101, width: 41, height: 11 }),
    makeNode("postgres", { x: 55, y: 101, width: 41, height: 11 }),
  ],
  connections: [
    { from: "request", to: "validation", fromSide: "bottom", toSide: "top", tone: "blue" },
    { from: "validation", to: "authentication", fromSide: "bottom", toSide: "top", tone: "neutral" },
    { from: "authentication", to: "policy", fromSide: "bottom", toSide: "top", tone: "blue" },
    { from: "policy", to: "database", fromSide: "bottom", toSide: "top", tone: "neutral" },
    { from: "database", to: "response", fromSide: "bottom", toSide: "top", tone: "blue" },
    { from: "validation", to: "redis", fromSide: "bottom", toSide: "top", tone: "orange" },
    { from: "database", to: "postgres", fromSide: "bottom", toSide: "top", tone: "orange" },
  ],
};

const workflowStages = [
  ["prompt", "Developer prompt", "A human describes the backend outcome and constraints."],
  ["agent", "MCP-compatible AI agent", "The agent proposes a structured change instead of a code dump."],
  ["server", "Blue Lizard MCP Server", "A planned protocol boundary would expose bounded blueprint operations."],
  ["tools", "Blueprint tools / graph definitions", "Nodes, connections, and configuration become explicit project context."],
  ["checks", "Validation and security checks", "The graph can be checked for structure, policy, and dependency violations."],
  ["output", "Backend build output", "A validated blueprint becomes input to the intended build workflow."],
] as const;

function pointFor(node: BlueprintNodeData, side: ConnectionSide): BlueprintPoint {
  const { x, y, width, height } = node.position;
  if (side === "top") return { x: x + width / 2, y };
  if (side === "right") return { x: x + width, y: y + height / 2 };
  if (side === "left") return { x, y: y + height / 2 };
  return { x: x + width / 2, y: y + height };
}

function Graph({ layout, variant, selectedId, onSelect }: { readonly layout: GraphLayout; readonly variant: "desktop" | "mobile"; readonly selectedId: string; readonly onSelect: (id: string) => void }) {
  const byId = useMemo(() => new Map(layout.nodes.map((node) => [node.id, node])), [layout.nodes]);

  return (
    <div className={`mcp-graph mcp-graph-${variant}`} style={{ aspectRatio: `100 / ${layout.height}` }} aria-label={`${variant} layout of the illustrative agent response graph`}>
      <svg className="blueprint-connections" viewBox={`0 0 100 ${layout.height}`} preserveAspectRatio="none" role="img" aria-label="Typed connections between the proposed backend nodes">
        {layout.connections.map((connection) => {
          const from = byId.get(connection.from);
          const to = byId.get(connection.to);
          if (!from || !to) return null;
          return <BlueprintConnection key={`${variant}-${connection.from}-${connection.to}`} from={pointFor(from, connection.fromSide)} to={pointFor(to, connection.toSide)} tone={connection.tone} />;
        })}
      </svg>
      {layout.nodes.map((node) => <BlueprintNode key={node.id} node={node} selected={node.id === selectedId} onSelect={onSelect} />)}
    </div>
  );
}

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
          <Graph layout={desktopLayout} variant="desktop" selectedId={selectedId} onSelect={setSelectedId} />
          <Graph layout={mobileLayout} variant="mobile" selectedId={selectedId} onSelect={setSelectedId} />
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
