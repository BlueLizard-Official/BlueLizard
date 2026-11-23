import Link from "next/link";

const plannedFeatures = [
  "Visual backend blueprints",
  "Blueprint validation",
  "Backend code generation",
  "MCP agent integration",
  "Docker Compose output",
  "Environment configuration templates",
  "Developer-owned generated code",
  "Self-hosting on a VPS",
] as const;

type PricingCardProps = {
  readonly compact?: boolean;
};

export function PricingCard({ compact = false }: PricingCardProps) {
  return (
    <article className={`developer-pricing-card${compact ? " developer-pricing-card-compact" : ""}`}>
      <div className="developer-pricing-card-header">
        <div><span className="pricing-card-label">BlueLizard</span><h3>Developer License</h3></div>
        <span className="developer-pricing-status">Planned</span>
      </div>
      <p className="developer-pricing-price">Pricing on consultation</p>
      <ul className="developer-pricing-features">{plannedFeatures.map((feature) => <li key={feature}><span aria-hidden="true">+</span>{feature}</li>)}</ul>
      <div className="developer-pricing-card-footer"><p>Tell us what you plan to build so we can discuss license options.</p><Link className="button-primary" href="/contact">Request a consultation</Link></div>
    </article>
  );
}
