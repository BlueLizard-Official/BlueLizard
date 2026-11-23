import { BlueprintConnection } from "./blueprint-connection";
import { BlueprintNode, type BlueprintNodeData } from "./blueprint-node";

const signupSteps = ["request", "validation", "redis", "authentication", "policy", "database", "response"] as const;

type SignupNodeId = (typeof signupSteps)[number] | "postgres";
type SignupNodeContent = Record<SignupNodeId, Omit<BlueprintNodeData, "id" | "position">>;

export function SignupBlueprintGraph({
  content,
  selectedId,
  onSelect,
}: {
  readonly content: SignupNodeContent;
  readonly selectedId: string;
  readonly onSelect: (id: string) => void;
}) {
  return (["desktop", "mobile"] as const).map((variant) => {
    const x = variant === "desktop" ? 22 : 3;
    const width = variant === "desktop" ? 43 : 56;
    const storageX = variant === "desktop" ? 73 : 65;
    const storageWidth = variant === "desktop" ? 25 : 33;
    const nodes = signupSteps.map((id, index) => ({
      ...content[id],
      id,
      position: { x, y: 2 + index * 14, width, height: 12 },
    }));
    const query = nodes[signupSteps.indexOf("database")].position;
    const laneX = x + width / 2;
    const storageY = query.y + query.height / 2;
    const storage = {
      ...content.postgres,
      id: "postgres",
      position: { ...query, x: storageX, width: storageWidth },
    };

    return (
      <div key={variant} className={`blueprint-graph blueprint-graph-${variant}`} aria-label="Conceptual signup backend blueprint">
        <svg className="blueprint-connections" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {nodes.slice(1).map(({ id, position }, index) => (
            <BlueprintConnection
              key={id}
              from={{ x: laneX, y: nodes[index].position.y + nodes[index].position.height }}
              to={{ x: laneX, y: position.y }}
              tone="blue"
            />
          ))}
          <BlueprintConnection from={{ x: x + width, y: storageY }} to={{ x: storageX, y: storageY }} tone="orange" />
        </svg>
        {[...nodes, storage].map((node) => (
          <BlueprintNode key={node.id} node={node} selected={selectedId === node.id} onSelect={onSelect} />
        ))}
      </div>
    );
  });
}
