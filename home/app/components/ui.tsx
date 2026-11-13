import Link from "next/link";

export function Eyebrow({ children }: { children: React.ReactNode }) { return <p className="eyebrow">{children}</p>; }

export function PageIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <section className="page-intro"><div className="container"><Eyebrow>{eyebrow}</Eyebrow><h1>{title}</h1><p>{description}</p></div></section>;
}

export function SectionHeading({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
  return <div className="section-heading"><div>{eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}<h2>{title}</h2></div>{description ? <p>{description}</p> : null}</div>;
}

export function FeatureCard({ number, title, description, status }: { number: string; title: string; description: string; status: "In progress" | "Planned" | "Available" }) {
  const statusClass = status === "In progress" ? "badge-in-progress" : status === "Available" ? "badge-available" : "badge-planned";
  return <article className="feature-card"><div className="feature-card-number">{number}</div><h3>{title}</h3><p>{description}</p><div className="feature-card-footer"><span className={`badge ${statusClass}`}>{status}</span></div></article>;
}

export function CTA({ title, description, actionLabel = "Read the roadmap", actionHref = "/roadmap" }: { title: string; description: string; actionLabel?: string; actionHref?: string }) {
  return <section className="cta-band"><div className="container"><h2>{title}</h2><p>{description}</p><Link className="button-primary" href={actionHref}>{actionLabel}<span aria-hidden="true">→</span></Link></div></section>;
}

export function TechnicalDiagram({ mcp = false }: { mcp?: boolean }) {
  const nodes = mcp ? [["AI Coding Agent", "Compatible tools and agents"], ["Blue Lizard MCP Server", "Structured tool interface"], ["Shared Blue Lizard Core", "Common project capabilities"], ["Project / Build / Validation", "Intended execution surface"]] : [["Developer / AI Agent", "A request, change, or inspection"], ["Blue Lizard CLI / MCP", "The intended entry point"], ["Structured Backend Blueprint", "Nodes, connections, and operations"], ["Validation & Build Pipeline", "Checks and build orchestration"], ["Backend Application", "A supported application target"]];
  return <div className="diagram" aria-label={mcp ? "Intended MCP architecture" : "Intended Blue Lizard architecture"}><div className="diagram-stack">{nodes.map(([title, description], index) => <div key={title} className="diagram-stack"><div className="diagram-node"><strong>{title}</strong><span>{description}</span></div>{index < nodes.length - 1 ? <div className="diagram-arrow" aria-hidden="true">↓</div> : null}</div>)}<p className="diagram-caption">Intended architecture; implementation details are evolving.</p></div></div>;
}
