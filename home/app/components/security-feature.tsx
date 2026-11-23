type SecurityFeatureStatus = "Planned" | "In progress" | "Available";

type SecurityFeatureProps = {
  readonly number: string;
  readonly title: string;
  readonly description: string;
  readonly status: SecurityFeatureStatus;
  readonly implementationNote: string;
};

export function SecurityFeature({ number, title, description, status, implementationNote }: SecurityFeatureProps) {
  const statusClass = status === "Available" ? "badge-available" : status === "In progress" ? "badge-in-progress" : "badge-planned";

  return (
    <article className="security-feature">
      <div className="security-feature-top">
        <span className="security-feature-number">{number}</span>
        <span className={`badge ${statusClass}`}>{status}</span>
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="security-feature-note">{implementationNote}</div>
    </article>
  );
}
