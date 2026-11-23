import type { CSSProperties } from "react";

export type BlueprintSocket = {
  readonly label: string;
  readonly type: "request" | "data" | "policy" | "cache" | "response";
};

export type BlueprintNodePosition = {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
};

export type BlueprintNodeData = {
  readonly id: string;
  readonly title: string;
  readonly category: string;
  readonly categoryTone: "blue" | "orange" | "slate" | "green";
  readonly description: string;
  readonly purpose: string;
  readonly configuration: string;
  readonly inputs: readonly BlueprintSocket[];
  readonly outputs: readonly BlueprintSocket[];
  readonly position: BlueprintNodePosition;
};

type BlueprintNodeProps = {
  readonly node: BlueprintNodeData;
  readonly selected: boolean;
  readonly onSelect: (id: string) => void;
};

export function BlueprintNode({ node, selected, onSelect }: BlueprintNodeProps) {
  const style = {
    left: `${node.position.x}%`,
    top: `${node.position.y}%`,
    width: `${node.position.width}%`,
    height: `${node.position.height}%`,
  } satisfies CSSProperties;

  return (
    <button
      className={`blueprint-node${selected ? " is-selected" : ""}`}
      data-category-tone={node.categoryTone}
      style={style}
      type="button"
      aria-label={`Select ${node.title} blueprint node. ${node.description}. Inputs: ${node.inputs.map((socket) => `${socket.label} (${socket.type})`).join(", ")}. Outputs: ${node.outputs.map((socket) => `${socket.label} (${socket.type})`).join(", ")}.`}
      aria-pressed={selected}
      onClick={() => onSelect(node.id)}
    >
      <span className="blueprint-node-header">
        <span className={`blueprint-node-indicator tone-${node.categoryTone}`} aria-hidden="true" />
        <span className="blueprint-node-category">{node.category}</span>
      </span>
      <span className="blueprint-node-title">{node.title}</span>
      <span className="blueprint-node-description">{node.description}</span>
      <span className="blueprint-node-sockets">
        <span className="blueprint-node-socket-group">
          {node.inputs.map((socket) => (
            <span className="blueprint-socket socket-input" data-socket-type={socket.type} key={socket.label} aria-label={`${socket.label} input socket, ${socket.type} type`}>
              <span className="blueprint-socket-dot" />
              <span>{socket.label}</span>
            </span>
          ))}
        </span>
        <span className="blueprint-node-socket-group socket-group-output">
          {node.outputs.map((socket) => (
            <span className="blueprint-socket socket-output" data-socket-type={socket.type} key={socket.label} aria-label={`${socket.label} output socket, ${socket.type} type`}>
              <span>{socket.label}</span>
              <span className="blueprint-socket-dot" />
            </span>
          ))}
        </span>
      </span>
    </button>
  );
}
