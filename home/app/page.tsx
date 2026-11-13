import type { Metadata } from "next";
import Link from "next/link";
import { CodeBlock } from "./components/code-block";
import { CTA, Eyebrow, FeatureCard, SectionHeading, TechnicalDiagram } from "./components/ui";

export const metadata: Metadata = {
  title: "Backend development, built with structure.",
  description: "Blue Lizard is an actively developed toolkit for structured backend workflows, build tooling, security analysis, and AI-assisted development.",
  alternates: { canonical: "/" },
};

const features = [
  ["01", "Structured Backend Blueprints", "Graph-based representations of backend logic, including nodes, connections, and typed operations.", "In progress"],
  ["02", "Build Workflows", "A CLI-oriented workflow for processing and building backend projects.", "In progress"],
  ["03", "Security Analysis", "Planned validation and security checks for unsafe patterns and configuration issues.", "Planned"],
  ["04", "MCP Integration", "An intended Model Context Protocol interface for compatible AI coding tools.", "Planned"],
  ["05", "Backend Serving", "A consistent workflow for starting supported backend applications.", "Planned"],
  ["06", "Developer Diagnostics", "Actionable feedback about configuration, build failures, and potential security problems.", "Planned"],
] as const;

export default function Home() {
  return <>
    <section className="hero"><div className="container"><div className="hero-grid"><div>
      <Eyebrow>Blue Lizard / Developer tooling</Eyebrow>
      <h1>Backend development, built with structure.</h1>
      <p className="hero-description">Blue Lizard is an actively developed toolkit for designing, validating, building, and serving backend applications through structured workflows and AI-assisted development.</p>
      <div className="status-line">Under Active Development</div>
      <div className="hero-actions"><Link className="button-dark" href="/about">Explore Blue Lizard <span aria-hidden="true">→</span></Link><Link className="text-link" href="/roadmap">View Development Roadmap <span className="text-link-arrow" aria-hidden="true">↗</span></Link></div>
      <p className="hero-note">The interfaces and commands shown here describe an evolving project.</p>
    </div><CodeBlock label="Planned workflow" code={`npm install -g @bluelizard/cli\n\nlizard build\nlizard serve`} note="Example workflow shown for direction; verify package availability before use." /></div>
      <div className="preview-card" aria-label="Blue Lizard technical preview"><div className="preview-layout"><div className="preview-pane preview-sidebar"><strong>blue-lizard</strong><div className="selected">▸ blueprint</div><div>▸ config</div><div>▸ services</div><div>▸ checks</div><div>▸ output</div></div><div className="preview-pane preview-editor"><div><span className="line-number">01</span><span className="syntax">blueprint</span> <span className="value">backend</span></div><div><span className="line-number">02</span>  <span className="type">node</span> <span className="value">api</span></div><div><span className="line-number">03</span>  <span className="type">connect</span> <span className="value">api</span> <span className="operator">→</span> <span className="value">database</span></div><div><span className="line-number">04</span>  <span className="type">validate</span> <span className="value">security</span></div><div><span className="line-number">05</span>  <span className="syntax">build</span> <span className="argument">target=service</span></div></div><div className="preview-pane preview-chat"><strong>Diagnostics</strong><div className="chat-line">Blueprint structure ready for validation.</div><div className="chat-line">Build and security checks are evolving.</div></div></div></div>
    </div></section>

    <section className="section section-bordered"><div className="container"><SectionHeading eyebrow="The premise" title="A structured approach to backend engineering." /><p className="intro-copy">Backend work often spans fragmented tools, configuration layers, security requirements, and runtime concerns. Blue Lizard aims to make that work more understandable and maintainable by giving projects a shared representation that can be inspected, validated, and acted on by both developers and compatible AI tools.</p></div></section>

    <section className="section section-bordered"><div className="container"><SectionHeading eyebrow="Capabilities" title="Tools for the parts of backend work that need context." description="Each capability is being developed with an explicit status. Planned ideas are not presented as shipped features." /><div className="feature-grid">{features.map(([number, title, description, status]) => <FeatureCard key={number} number={number} title={title} description={description} status={status} />)}</div></div></section>

    <section className="section section-bordered"><div className="container"><SectionHeading eyebrow="How it fits together" title="One intended path from idea to running service." description="The architecture below describes the direction of the project, not a claim that every layer is currently implemented." /><TechnicalDiagram /></div></section>

    <section className="section section-bordered"><div className="container"><div className="status-band"><div><h3>Currently under active development.</h3><p>Interfaces, supported features, and implementation details may change as the project evolves.</p></div><Link className="button-secondary" href="/roadmap">See the roadmap <span aria-hidden="true">→</span></Link></div></div></section>

    <section className="section section-bordered"><div className="container"><SectionHeading eyebrow="Contact" title="Questions about Blue Lizard?" description="For technical inquiries, feedback, collaboration discussions, or general questions, contact the project directly." /><Link className="text-link" href="/contact">contact@bluelizard.sbs <span className="text-link-arrow" aria-hidden="true">↗</span></Link></div></section>
    <CTA title="Build with a clearer model of your backend." description="Follow the project as the CLI, blueprint system, validation pipeline, and MCP interface take shape." actionLabel="Read the roadmap" actionHref="/roadmap" />
  </>;
}
