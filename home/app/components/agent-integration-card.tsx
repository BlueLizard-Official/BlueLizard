type IntegrationStatus = "Planned" | "In development" | "Available";

type AgentIntegrationCardProps = {
  readonly name: string;
  readonly description: string;
  readonly status: IntegrationStatus;
};

export function AgentIntegrationCard({ name, description, status }: AgentIntegrationCardProps) {
  const statusClass = status === "Available" ? "available" : status === "In development" ? "in-development" : "planned";

  return (
    <article className="agent-integration-card">
      <div className="agent-integration-card-top">
        <span className="agent-integration-mark" aria-hidden="true">↗</span>
        <span className={`agent-integration-status agent-integration-status-${statusClass}`}>{status}</span>
      </div>
      <h3>{name}</h3>
      <p>{description}</p>
      <span className="agent-integration-evidence">Status based on current repository implementation</span>
    </article>
  );
}
