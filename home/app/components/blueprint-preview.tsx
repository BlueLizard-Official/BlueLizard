"use client";

import { useMemo, useState } from "react";
import {
  BlueprintNode,
  type BlueprintNodeData,
  type BlueprintNodePosition,
} from "./blueprint-node";
import { BlueprintConnection, type BlueprintPoint } from "./blueprint-connection";

type ConnectionDefinition = {
  readonly from: string;
  readonly to: string;
  readonly fromSide: "top" | "right" | "bottom" | "left";
  readonly toSide: "top" | "right" | "bottom" | "left";
  readonly tone: "blue" | "orange" | "neutral";
};

type BlueprintLayout = {
  readonly height: number;
  readonly nodes: readonly BlueprintNodeData[];
  readonly connections: readonly ConnectionDefinition[];
};

const nodeContent = {
  request: {
    title: "HTTP POST /signup",
    category: "Endpoint",
    categoryTone: "blue" as const,
    description: "Accept a new account request",
    purpose: "Defines the public entry point and the contract an incoming request must satisfy.",
    configuration: "POST /signup · JSON body · 201 / 400",
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
    outputs: [
      { label: "valid", type: "data" as const },
      { label: "limit", type: "cache" as const },
    ],
  },
  authentication: {
    title: "Authentication",
    category: "Identity",
    categoryTone: "blue" as const,
    description: "Create or resolve an identity",
    purpose: "Separates identity decisions from the transport layer and prepares a principal for policy evaluation.",
    configuration: "provider: email · session: pending",
    inputs: [{ label: "valid", type: "data" as const }],
    outputs: [{ label: "principal", type: "data" as const }],
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
    inputs: [{ label: "allowed", type: "data" as const }],
    outputs: [{ label: "user", type: "data" as const }],
  },
  response: {
    title: "Return Response",
    category: "Output",
    categoryTone: "slate" as const,
    description: "Return a typed success envelope",
    purpose: "Makes the final response a deliberate part of the backend blueprint rather than an afterthought.",
    configuration: "status: 201 · body: UserCreated · headers: safe",
    inputs: [{ label: "user", type: "response" as const }],
    outputs: [{ label: "response", type: "response" as const }],
  },
  redis: {
    title: "Rate Limit",
    category: "Cache",
    categoryTone: "orange" as const,
    description: "Throttle repeated signup attempts",
    purpose: "Shows a side effect that is connected to the flow without obscuring the main request path.",
    configuration: "Redis · key: ip + email · window: 60s",
    inputs: [{ label: "limit", type: "cache" as const }],
    outputs: [{ label: "allowed", type: "cache" as const }],
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

function node(id: keyof typeof nodeContent, position: BlueprintNodePosition): BlueprintNodeData {
  return { id, ...nodeContent[id], position };
}

const desktopLayout: BlueprintLayout = {
  height: 86,
  nodes: [
    node("request", { x: 35, y: 4, width: 30, height: 9 }),
    node("validation", { x: 35, y: 18, width: 30, height: 9 }),
    node("authentication", { x: 35, y: 32, width: 30, height: 9 }),
    node("policy", { x: 35, y: 46, width: 30, height: 9 }),
    node("database", { x: 35, y: 60, width: 30, height: 9 }),
    node("response", { x: 35, y: 74, width: 30, height: 9 }),
    node("redis", { x: 2, y: 29, width: 27, height: 10 }),
    node("postgres", { x: 71, y: 57, width: 27, height: 10 }),
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

const mobileLayout: BlueprintLayout = {
  height: 154,
  nodes: [
    node("request", { x: 14, y: 3, width: 72, height: 9 }),
    node("validation", { x: 14, y: 19, width: 72, height: 9 }),
    node("authentication", { x: 14, y: 35, width: 72, height: 9 }),
    node("policy", { x: 14, y: 51, width: 72, height: 9 }),
    node("database", { x: 14, y: 67, width: 72, height: 9 }),
    node("response", { x: 14, y: 83, width: 72, height: 9 }),
    node("redis", { x: 4, y: 101, width: 41, height: 11 }),
    node("postgres", { x: 55, y: 101, width: 41, height: 11 }),
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

function pointFor(nodeItem: BlueprintNodeData, side: ConnectionDefinition["fromSide"]): BlueprintPoint {
  const { x, y, width, height } = nodeItem.position;
  if (side === "top") return { x: x + width / 2, y };
  if (side === "right") return { x: x + width, y: y + height / 2 };
  if (side === "left") return { x, y: y + height / 2 };
  return { x: x + width / 2, y: y + height };
}

function Graph({
  layout,
  variant,
  selectedId,
  onSelect,
}: {
  readonly layout: BlueprintLayout;
  readonly variant: "desktop" | "mobile";
  readonly selectedId: string;
  readonly onSelect: (id: string) => void;
}) {
  const byId = useMemo(() => new Map(layout.nodes.map((nodeItem) => [nodeItem.id, nodeItem])), [layout.nodes]);

  return (
    <div className={`blueprint-graph blueprint-graph-${variant}`} style={{ aspectRatio: `100 / ${layout.height}` }} aria-label={`${variant} layout of the conceptual signup backend blueprint`}>
      <svg className="blueprint-connections" viewBox={`0 0 100 ${layout.height}`} preserveAspectRatio="none" role="img" aria-label="Connections between backend blueprint nodes">
        {layout.connections.map((connection) => {
          const from = byId.get(connection.from);
          const to = byId.get(connection.to);
          if (!from || !to) return null;
          return <BlueprintConnection key={`${variant}-${connection.from}-${connection.to}`} from={pointFor(from, connection.fromSide)} to={pointFor(to, connection.toSide)} tone={connection.tone} />;
        })}
      </svg>
      {layout.nodes.map((nodeItem) => <BlueprintNode key={nodeItem.id} node={nodeItem} selected={selectedId === nodeItem.id} onSelect={onSelect} />)}
    </div>
  );
}

export function BlueprintPreview() {
  const [selectedId, setSelectedId] = useState("request");
  const selectedNode = nodeContent[selectedId as keyof typeof nodeContent];

  return (
    <section className="blueprint-preview" id="blueprint" aria-labelledby="blueprint-preview-title">
      <div className="blueprint-preview-header">
        <div><p className="blueprint-kicker">Conceptual preview</p><h2 id="blueprint-preview-title">A backend you can inspect at a glance.</h2></div>
        <p className="blueprint-preview-note">Click a node to inspect its purpose and configuration.</p>
      </div>
      <div className="blueprint-workspace">
        <div className="blueprint-workspace-bar"><span className="workspace-title"><span className="workspace-status-dot" aria-hidden="true" /> signup.blueprint</span><span className="workspace-meta">8 nodes · 7 connections · draft</span></div>
        <div className="blueprint-grid-surface">
          <Graph layout={desktopLayout} variant="desktop" selectedId={selectedId} onSelect={setSelectedId} />
          <Graph layout={mobileLayout} variant="mobile" selectedId={selectedId} onSelect={setSelectedId} />
        </div>
        <div className="blueprint-workspace-footer"><span><i className="legend-line legend-line-blue" aria-hidden="true" /> primary flow</span><span><i className="legend-line legend-line-orange" aria-hidden="true" /> infrastructure dependency</span><span className="workspace-footer-note">Illustrative graph, not the live editor</span></div>
      </div>
      <aside className="blueprint-inspector" aria-live="polite" aria-label="Selected blueprint node details">
        <div className="inspector-heading"><span className="blueprint-kicker">Selected node</span><span className="inspector-node-count">{selectedNode.category}</span></div>
        <div className="inspector-content"><h3>{selectedNode.title}</h3><p>{selectedNode.purpose}</p><dl><div><dt>Configuration</dt><dd>{selectedNode.configuration}</dd></div><div><dt>Inputs</dt><dd>{selectedNode.inputs.map((socket) => socket.label).join(" · ")}</dd></div><div><dt>Outputs</dt><dd>{selectedNode.outputs.map((socket) => socket.label).join(" · ")}</dd></div></dl></div>
      </aside>
    </section>
  );
}
