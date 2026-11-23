export type BlueprintPoint = {
  readonly x: number;
  readonly y: number;
};

type BlueprintConnectionProps = {
  readonly from: BlueprintPoint;
  readonly to: BlueprintPoint;
  readonly tone?: "blue" | "orange" | "neutral";
};

function connectionPath(from: BlueprintPoint, to: BlueprintPoint): string {
  const horizontal = Math.abs(to.x - from.x) > Math.abs(to.y - from.y);

  if (horizontal) {
    const distance = (to.x - from.x) * 0.46;
    return `M ${from.x} ${from.y} C ${from.x + distance} ${from.y}, ${to.x - distance} ${to.y}, ${to.x} ${to.y}`;
  }

  const distance = (to.y - from.y) * 0.46;
  return `M ${from.x} ${from.y} C ${from.x} ${from.y + distance}, ${to.x} ${to.y - distance}, ${to.x} ${to.y}`;
}

export function BlueprintConnection({ from, to, tone = "neutral" }: BlueprintConnectionProps) {
  return (
    <g className={`blueprint-connection blueprint-connection-${tone}`} aria-hidden="true">
      <path d={connectionPath(from, to)} vectorEffect="non-scaling-stroke" />
      <circle cx={from.x} cy={from.y} r="0.40" vectorEffect="non-scaling-stroke" />
      <circle cx={to.x} cy={to.y} r="0.40" vectorEffect="non-scaling-stroke" />
    </g>
  );
}
