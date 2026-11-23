import { CTA, PageIntro } from "../components/ui";
import { pageMetadata } from "../lib/metadata";

export const metadata = pageMetadata({ title: "Development Roadmap", description: "Blue Lizard development roadmap with planned, in-progress, and available areas of work.", path: "/roadmap", image: "/og/roadmap.png", imageAlt: "Blue Lizard Roadmap: Building Blue Lizard." });

const roadmap = [
  ["Foundation", "In progress", "Establish the project surface that other capabilities can build on.", ["CLI structure", "Configuration handling", "Project discovery"]],
  ["Blueprint System", "In progress", "Define a graph representation that can describe backend logic with useful structure.", ["Graph representation", "Typed operations", "Validation and serialization"]],
  ["Build Pipeline", "Planned", "Turn structured project information into a repeatable processing and build workflow.", ["Intermediate representation", "Code generation", "Build orchestration"]],
  ["Security", "Planned", "Add security-oriented checks that fit into normal development workflows.", ["Static checks", "Configuration analysis", "Authorization checks", "Diagnostic reporting"]],
  ["MCP Integration", "Planned", "Expose structured capabilities to compatible AI coding agents through an MCP interface.", ["Project inspection", "Blueprint tools", "Build and validation tools"]],
  ["Runtime", "Planned", "Provide serving and supported deployment workflows for backend applications.", ["Backend serving", "Runtime configuration", "Supported deployment workflows"]],
  ["Developer Experience", "Planned", "Make the system easier to understand and integrate as it grows.", ["Documentation", "Diagnostics and error messages", "Integration tooling"]],
] as const;

export default function RoadmapPage() {
  return <><PageIntro eyebrow="Project direction" title="Development Roadmap" description="Blue Lizard is being built iteratively toward an MVP target of December 3, 2026. This roadmap communicates areas of work without percentages or commitments that have not been verified." /><section className="section"><div className="container"><div className="status-band status-legend"><div><h3>Status labels</h3><p>Available is reserved for features verified in the project.</p></div><div className="email-actions"><span className="badge badge-in-progress">In progress</span><span className="badge badge-planned">Planned</span><span className="badge">Available</span></div></div><div className="roadmap-grid">{roadmap.map(([title, status, description, items]) => <article className="roadmap-card" key={title}><div className="roadmap-card-header"><h2>{title}</h2><span className={`badge ${status === "In progress" ? "badge-in-progress" : "badge-planned"}`}>{status}</span></div><p>{description}</p><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></article>)}</div></div></section><section className="section section-bordered"><div className="container"><div className="status-band"><div><h3>Roadmap status is intentionally qualitative.</h3><p>Only features verified as available are marked Available. The December 3, 2026 date is an MVP target, not a completed release commitment.</p></div></div></div></section><CTA title="Have a question about the direction?" description="Technical feedback and project questions are welcome by email." actionLabel="Contact Blue Lizard" actionHref="/contact" /></>;
}
