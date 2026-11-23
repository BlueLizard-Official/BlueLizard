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
        <div><span className="pricing-card-label">Blue Lizard</span><h3>Developer License</h3></div>
        <span className="developer-pricing-status">Planned</span>
      </div>
      <div className="developer-pricing-price"><span className="developer-pricing-currency">₹</span><strong>256</strong><span className="developer-pricing-period">/ month</span></div>
      <p className="developer-pricing-billing">Monthly subscription · Planned introductory pricing</p>
      <ul className="developer-pricing-features">{plannedFeatures.map((feature) => <li key={feature}><span aria-hidden="true">+</span>{feature}</li>)}</ul>
      <div className="developer-pricing-card-footer"><p>Pricing is planned for the upcoming release and may evolve before public availability.</p><Link className="button-primary" href="/waitlist">Join the Waitlist</Link></div>
    </article>
  );
}
