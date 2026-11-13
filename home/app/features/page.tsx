import type { Metadata } from "next";
import { CTA, PageIntro, SectionHeading } from "../components/ui";

export const metadata: Metadata = { title: "Features", description: "Explore Blue Lizard's intended blueprint, build, security, MCP, runtime, and diagnostics capabilities.", alternates: { canonical: "/features" } };

const items = [
  ["Blueprint-based backend representation", "Describe backend structure as a shared model of services, operations, and relationships. This addresses the gap between scattered source files and the system those files form.", "In progress", "The blueprint direction is part of the active project scope; exact syntax and persistence are evolving."],
  ["Typed nodes and connections", "Make important backend relationships explicit, so tools can reason about valid connections and the operations that pass between them.", "Planned", "The concept is defined at the product level; a verified public implementation is not available in this repository."],
  ["Intermediate representation and validation", "Create a validation boundary between a project description and later build steps, with room for structural and configuration checks.", "Planned", "Validation is a planned capability; no implementation claim is made here."],
  ["Backend build orchestration", "Coordinate the processing required to turn a structured backend project into a buildable application target.", "In progress", "The CLI-oriented build workflow is part of the evolving direction; supported targets are not yet documented as stable."],
  ["CLI workflows", "Give developers a direct command-line surface for working with Blue Lizard projects.", "In progress", "The package name and executable are defined for the project, but publication and current command behavior require verification."],
  ["MCP integration", "Offer structured tools to compatible AI coding agents through a Model Context Protocol interface.", "Planned", "The integration is described as intended; no installation command is presented without verified implementation."],
  ["Security-oriented checks", "Help surface unsafe patterns, configuration issues, and authorization concerns earlier in the development workflow.", "Planned", "Security analysis is a planned direction, not a security guarantee or a completed scanner."],
  ["Runtime and serving workflows", "Provide a consistent way to start supported backend applications after the project has been processed.", "Planned", "Serving is part of the intended workflow; supported runtimes are not yet verified here."],
  ["Diagnostics and error reporting", "Return actionable context about configuration, build failures, and potential security problems.", "Planned", "Diagnostics are a design goal; the exact error format remains subject to change."],
  ["Future extensibility", "Keep the shared model open to additional backends, checks, integrations, and developer workflows over time.", "Planned", "Extensibility is a long-term principle rather than a claim about a current plugin system."],
] as const;

export default function FeaturesPage() {
  return <><PageIntro eyebrow="Capabilities" title="A technical surface that can grow with the project." description="Blue Lizard is being shaped around a shared backend model, with the CLI and MCP interface as practical entry points. The status beside each capability is intentionally conservative." /><section className="section"><div className="container"><SectionHeading eyebrow="Feature map" title="Intended capabilities, described precisely." /><div className="technical-list">{items.map(([title, purpose, status, implementation]) => <article className="technical-item" key={title}><h3>{title}</h3><p>{purpose}</p><div className="technical-meta"><span className={`badge ${status === "In progress" ? "badge-in-progress" : "badge-planned"}`}>{status}</span><span>{implementation}</span></div></article>)}</div></div></section><CTA title="Track the implementation as it evolves." description="The roadmap separates the foundation work from longer-term capabilities and only marks verified items as available." actionLabel="Open development roadmap" actionHref="/roadmap" /></>;
}
