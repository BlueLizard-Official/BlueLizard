import Link from "next/link";
import { PricingCard } from "./components/pricing-card";
import { BuildOutputPreview } from "./components/build-output-preview";
import { BlueprintPreview } from "./components/blueprint-preview";
import { CTA, Eyebrow, SectionHeading, StatusPill } from "./components/ui";
import { pageMetadata } from "./lib/metadata";

export const metadata = pageMetadata({
  title: "Design the backend before you generate the code.",
  description: "Blue Lizard turns backend development into visual blueprints that developers and AI coding agents can inspect, validate, and build.",
  path: "/",
  image: "/og/home.png",
  imageAlt: "Blue Lizard visual backend blueprint preview",
});

const blueprintPrinciples = [
  ["01", "Every dependency is visible", "Requests, policies, queues, stores, and responses live in one inspectable graph."],
  ["02", "Every connection has a type", "Typed sockets make data flow and infrastructure boundaries legible to humans and agents."],
  ["03", "Every change has context", "Blueprints give build systems and AI tools a shared model of what a backend change affects."],
] as const;

const workflowSteps = [
  ["Define", "Place the endpoint, data, policy, and infrastructure nodes that describe the system you intend to build."],
  ["Connect", "Draw explicit relationships between inputs, transformations, permissions, storage, and outputs."],
  ["Build", "Use the blueprint as structured context for validation, code generation, deployment, and diagnostics."],
] as const;

const securityPrinciples = [
  ["Least privilege", "Make permission boundaries part of the architecture, not a comment left behind in a source file."],
  ["Inspectable flows", "Review how identity, policy, data, and infrastructure connect before a change reaches production."],
  ["Safe agent actions", "Give AI coding agents bounded context and explicit operations instead of an unstructured workspace."],
] as const;

const faqs = [
  ["Is the blueprint editor available today?", "Not yet. This homepage shows a conceptual preview of the visual system Blue Lizard is building. The nodes, connections, and inspector are illustrative, not a functioning editor."],
  ["Is Blue Lizard a replacement for my framework?", "Blue Lizard is intended to sit above existing backend technologies as a structured design, validation, and build layer. The supported runtime surface will become clearer as the project develops."],
  ["How will AI agents use a blueprint?", "The intended MCP integration gives compatible agents a structured representation of a backend so they can inspect relationships, propose changes, and return bounded diagnostics."],
  ["When is the MVP launching?", "The current launch message is December 3, 2026. Join the waitlist for updates as the product moves toward its MVP."],
] as const;

export default function Home() {
  return (
    <>
      <section className="blueprint-hero">
        <div className="container">
          <div className="blueprint-hero-grid">
            <div className="blueprint-hero-copy">
              <Eyebrow>Blue Lizard / Visual backend infrastructure</Eyebrow>
              <h1>Stop generating code.<br /><span>Start designing backends.</span></h1>
              <p className="blueprint-hero-description">Blue Lizard turns backend development into visual blueprints. Developers and AI coding agents can design, inspect, and build secure, deployable backend systems through structured nodes and connections.</p>
              <div className="blueprint-hero-status"><StatusPill tone="orange">MVP launching December 3, 2026</StatusPill></div>
              <div className="blueprint-hero-actions"><Link className="button-primary" href="/waitlist">Join the Waitlist</Link><a className="button-secondary" href="#blueprint">Explore the Blueprint</a></div>
              <p className="blueprint-hero-footnote"><span aria-hidden="true">⌁</span> Designed for developers, teams, and AI agents that need more context.</p>
            </div>
            <div className="hero-side-note" aria-label="Product positioning"><div className="hero-side-rule" /><p>Backend infrastructure is already a graph. Blue Lizard makes the graph the interface.</p><span>01 / 05</span></div>
          </div>
          <BlueprintPreview />
        </div>
      </section>

      <section className="blueprint-section blueprint-section-dark" id="structure">
        <div className="container">
          <div className="section-intro-wide"><Eyebrow>Why structure matters</Eyebrow><h2>AI agents can write code. They still need a model of the system.</h2><p>Source code is where a backend ends up. It is not always the clearest place to understand the relationships that produced it. Blueprints give people and agents a shared surface for reasoning before implementation.</p></div>
          <div className="principle-grid">{blueprintPrinciples.map(([number, title, description]) => <article className="principle-card" key={number}><span className="principle-number">{number}</span><h3>{title}</h3><p>{description}</p></article>)}</div>
        </div>
      </section>

      <section className="blueprint-section" id="workflow">
        <div className="container">
          <SectionHeading eyebrow="The workflow" title="A visual blueprint is a better starting point." description="The product is being shaped around a simple loop: make the system legible, make the change explicit, then make the build repeatable." />
          <div className="workflow-grid">{workflowSteps.map(([title, description], index) => <article className="workflow-card" key={title}><div className="workflow-card-top"><span>0{index + 1}</span><span className="workflow-card-line" /></div><h3>{title}</h3><p>{description}</p></article>)}</div>
        </div>
      </section>

      <section className="blueprint-section blueprint-section-lined" id="mcp-agents">
        <div className="container feature-split">
          <div><Eyebrow>For AI coding agents</Eyebrow><h2>Your AI agent. Our blueprints.</h2><p className="section-copy">Instead of asking an AI agent to generate an entire backend as plain code, let it construct explicit backend blueprints that can be inspected, edited and compiled.</p><p className="mcp-home-note">Planned MCP direction · no public server available yet.</p><Link className="text-link" href="/mcp">Explore the MCP workflow <span className="text-link-arrow" aria-hidden="true">↗</span></Link></div>
          <div className="agent-panel"><div className="agent-panel-bar"><span>agent.context</span><span>structured</span></div><div className="agent-panel-body"><div className="agent-row"><span className="agent-key">inspect</span><span className="agent-value">signup.blueprint</span></div><div className="agent-row"><span className="agent-key">scope</span><span className="agent-value">policy + data + runtime</span></div><div className="agent-row"><span className="agent-key">change</span><span className="agent-value agent-value-orange">add rate limit node</span></div><div className="agent-divider" /><p>“I can see the request path, the policy checkpoint, and the dependency that must change.”</p></div></div>
        </div>
      </section>

      <section className="blueprint-section" id="security">
        <div className="container"><SectionHeading eyebrow="Security-oriented by design" title="Security isn't a prompt. It's architecture." description="A secure backend needs visible boundaries for validation, identity, authorization, data, and operational configuration. Blue Lizard intends to represent those decisions in the blueprint before code is generated." /><div className="security-grid">{securityPrinciples.map(([title, description]) => <article className="security-card" key={title}><span className="security-card-mark" aria-hidden="true">+</span><h3>{title}</h3><p>{description}</p></article>)}</div><div className="security-home-boundary"><strong>Authentication verifies identity.</strong><span>Authorization evaluates access relationships and policies. OpenFGA is not an authentication provider.</span><a href="/features">Explore the architecture <span aria-hidden="true">↗</span></a></div></div>
      </section>

      <section className="blueprint-section blueprint-section-blue" id="build">
        <div className="container build-section-grid">
          <div><Eyebrow>From blueprint to backend</Eyebrow><h2>Build and export the system you can explain.</h2><p className="section-copy">A visual model should not become another silo. Blue Lizard is intended to connect the blueprint to build workflows, validation, deployment targets, and the diagnostics developers need to ship with confidence.</p><div className="build-points"><span>Blueprint as source of intent</span><span>Validation as a build step</span><span>Exportable backend workflows</span></div></div>
          <div className="export-panel" aria-label="Conceptual build export preview"><div className="export-panel-header"><span>blue-lizard build</span><span className="export-status">ready to inspect</span></div><div className="export-panel-body"><div><span className="export-line-number">01</span><span className="export-keyword">blueprint</span> <span>signup</span></div><div><span className="export-line-number">02</span><span className="export-keyword">target</span> <span>service / production</span></div><div><span className="export-line-number">03</span><span className="export-keyword">checks</span> <span>policy, schema, dependency</span></div><div><span className="export-line-number">04</span><span className="export-keyword">export</span> <span className="export-value">deployable backend</span></div></div><div className="export-panel-footer">Conceptual workflow · implementation in progress</div></div>
        </div>
      </section>

      <BuildOutputPreview />

      <section className="blueprint-section" id="pricing">
        <div className="container home-pricing-layout"><div><SectionHeading eyebrow="Pricing preview" title="One straightforward plan for the MVP." description="A planned monthly Developer License with a clear focus: visual backend infrastructure that remains in the developer's hands." /><p className="home-pricing-note">MVP target: December 3, 2026 · Pricing is planned for the upcoming release and may evolve before public availability.</p><Link className="text-link" href="/pricing">View the pricing preview</Link></div><PricingCard compact /></div>
      </section>

      <section className="blueprint-section legacy-home-pricing" id="pricing-legacy">
        <div className="container"><SectionHeading eyebrow="Pricing" title="Start with the foundation." description="The MVP pricing model is intentionally simple while the product surface is being validated." /><div className="pricing-grid"><article className="pricing-card pricing-card-featured"><div className="pricing-card-label">Early access</div><h3>Join the waitlist</h3><p>Get launch updates and help shape the first version of visual backend infrastructure.</p><div className="pricing-card-footer"><span>Coming with the MVP</span><Link className="button-primary" href="/waitlist">Join the Waitlist</Link></div></article><article className="pricing-card"><div className="pricing-card-label">Teams</div><h3>Defined with users</h3><p>Team workflows, collaboration, and deployment surfaces will be shaped around early product feedback.</p><div className="pricing-card-footer"><span>Details to follow</span></div></article><article className="pricing-card"><div className="pricing-card-label">Open direction</div><h3>Transparent by default</h3><p>Follow the roadmap as capabilities move from concept to verified implementation.</p><div className="pricing-card-footer"><Link className="text-link" href="/roadmap">Read the roadmap <span className="text-link-arrow" aria-hidden="true">↗</span></Link></div></article></div></div>
      </section>

      <section className="waitlist-banner" id="waitlist-signup"><div className="container waitlist-banner-inner"><div><Eyebrow>Early access</Eyebrow><h2>Design the next backend with us.</h2><p>Blue Lizard MVP launching December 3, 2026. Join the waitlist for product updates and early access.</p></div><Link className="button-dark" href="/waitlist">Join the Waitlist</Link></div></section>

      <section className="blueprint-section faq-section" id="faq"><div className="container faq-grid"><div><Eyebrow>FAQ</Eyebrow><h2>Clear about what is real, planned, and next.</h2><p className="section-copy">The preview is intentionally honest: it shows the product direction without presenting the conceptual graph as a shipped editor.</p></div><div className="faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></div></section>

      <CTA title="Give your backend a shape before it has a codebase." description="Join the early access list and follow Blue Lizard as visual blueprints become a new interface for backend infrastructure." actionLabel="Join the Waitlist" actionHref="/waitlist" />
    </>
  );
}
