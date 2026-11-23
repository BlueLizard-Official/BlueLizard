const architectureLayers = [
  ["Client", "Browser, mobile client, or service caller", "blue"],
  ["API Gateway / NestJS", "Transport boundary and application entry point", "blue"],
  ["Request Validation", "Schema checks, normalization, and bounded input", "orange"],
  ["Authentication", "Verify identity and establish a principal", "blue"],
  ["Authorization Policy (OpenFGA)", "Evaluate access relationships and policy", "orange"],
  ["Business Logic", "Domain operations and application decisions", "slate"],
  ["Prisma + PostgreSQL", "Typed persistence and durable application data", "green"],
] as const;

const supportingModules = [
  ["Redis", "Caching and rate limiting"],
  ["Object storage", "MinIO or another S3-compatible service"],
  ["PostgreSQL", "Configurable durable data store"],
  ["Secrets + environment", "Explicit runtime configuration"],
  ["Health checks", "Service readiness and dependencies"],
] as const;

export function InfrastructureDiagram() {
  return (
    <figure className="infrastructure-diagram" aria-labelledby="infrastructure-diagram-title">
      <div className="infrastructure-diagram-header">
        <div>
          <span className="blueprint-kicker">Conceptual architecture</span>
          <h3 id="infrastructure-diagram-title">A backend with visible boundaries.</h3>
        </div>
        <span className="infrastructure-diagram-status">Blueprint direction</span>
      </div>

      <div className="infrastructure-main-flow" aria-label="Primary backend architecture flow">
        {architectureLayers.map(([title, description, tone], index) => (
          <div className="infrastructure-flow-step" key={title}>
            <div className={`infrastructure-node infrastructure-node-${tone}`}>
              <span className="infrastructure-node-index">0{index + 1}</span>
              <strong>{title}</strong>
              <span>{description}</span>
            </div>
            {index < architectureLayers.length - 1 ? <span className="infrastructure-flow-arrow" aria-hidden="true">↓</span> : null}
          </div>
        ))}
      </div>

      <div className="infrastructure-supporting">
        <div className="infrastructure-supporting-heading"><span>Supporting modules</span><small>Choose the pieces your application needs.</small></div>
        <div className="infrastructure-supporting-grid">
          {supportingModules.map(([title, description]) => <div className="infrastructure-support-card" key={title}><span className="infrastructure-support-mark" aria-hidden="true">+</span><strong>{title}</strong><span>{description}</span></div>)}
        </div>
      </div>

      <figcaption>Illustrative system shape, not a claim that every service must be bundled or self-hosted.</figcaption>
    </figure>
  );
}
