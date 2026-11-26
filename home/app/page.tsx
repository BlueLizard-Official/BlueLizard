import Image from "next/image";
import Link from "next/link";
import { PricingCard } from "./components/pricing-card";
import { BuildOutputPreview } from "./components/build-output-preview";
import { BlueprintPreview } from "./components/blueprint-preview";
import { SignupTrace } from "./components/signup-trace";
import { CTA, Eyebrow, SectionHeading, StatusPill } from "./components/ui";
import { SITE_DESCRIPTION, SITE_TITLE } from "./lib/metadata";

export const metadata = { title: { absolute: SITE_TITLE }, description: SITE_DESCRIPTION };

const founders = [
  {
    name: "Swaraj Puppalwar",
    role: "Founder and CTO",
    photo: "/founders/swaraj-puppalwar.png",
    linkedin: "https://www.linkedin.com/in/swaraj-puppalwar/",
  },
  {
    name: "Armaan Watts",
    role: "Co-Founder and CEO",
    photo: "/founders/armaan-watts.png",
    linkedin: "https://www.linkedin.com/in/armaanwatts/",
  },
];

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
  ["Is the blueprint editor available today?", "Not yet. This homepage shows a conceptual preview of the visual system BlueLizard is building. The nodes, connections, and inspector are illustrative, not a functioning editor."],
  ["Is BlueLizard a replacement for my framework?", "BlueLizard is intended to sit above existing backend technologies as a structured design, validation, and build layer. The supported runtime surface will become clearer as the project develops."],
  ["How will AI agents use a blueprint?", "The intended MCP integration gives compatible agents a structured representation of a backend so they can inspect relationships, propose changes, and return bounded diagnostics."],
  ["What is the MVP target?", "December 3, 2026 is the current MVP target, not a completed release date. Join the waitlist for updates as the product moves toward that target."],
] as const;

export default function Home() {
  return (
    <>
      <section className="blueprint-hero">
        <div className="container">
          <div className="blueprint-hero-grid">
            <div className="blueprint-hero-copy">
              <Eyebrow>BlueLizard / Visual backend infrastructure</Eyebrow>
              <h1>See how your backend works <span>before you build it.</span></h1>
              <p className="blueprint-hero-description">Design your backend as a visual blueprint. Follow a request from the API endpoint to the database and see where validation, permissions, and infrastructure fit.</p>
              <div className="blueprint-hero-actions"><Link className="button-primary" href="/waitlist">Join the Waitlist</Link><a className="button-secondary" href="#blueprint">Explore the Blueprint</a></div>
              <div className="blueprint-hero-status"><StatusPill tone="orange">MVP target: December 3, 2026</StatusPill></div>
            </div>
            <SignupTrace />
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
        <div className="container"><SectionHeading eyebrow="Security-oriented by design" title="Security isn't a prompt. It's architecture." description="A secure backend needs visible boundaries for validation, identity, authorization, data, and operational configuration. BlueLizard intends to represent those decisions in the blueprint before code is generated." /><div className="security-grid">{securityPrinciples.map(([title, description]) => <article className="security-card" key={title}><span className="security-card-mark" aria-hidden="true">+</span><h3>{title}</h3><p>{description}</p></article>)}</div><div className="security-home-boundary"><strong>Authentication verifies identity.</strong><span>Authorization evaluates access relationships and policies. OpenFGA is not an authentication provider.</span><a href="/features">Explore the architecture <span aria-hidden="true">↗</span></a></div></div>
      </section>

      <section className="blueprint-section blueprint-section-blue" id="build">
        <div className="container build-section-grid">
          <div><Eyebrow>From blueprint to backend</Eyebrow><h2>Build and export the system you can explain.</h2><p className="section-copy">A visual model should not become another silo. BlueLizard is intended to connect the blueprint to build workflows, validation, deployment targets, and the diagnostics developers need to ship with confidence.</p><div className="build-points"><span>Blueprint as source of intent</span><span>Validation as a build step</span><span>Exportable backend workflows</span></div></div>
          <div className="export-panel" aria-label="Conceptual build export preview"><div className="export-panel-header"><span>blue-lizard build</span><span className="export-status">ready to inspect</span></div><div className="export-panel-body"><div><span className="export-line-number">01</span><span className="export-keyword">blueprint</span> <span>signup</span></div><div><span className="export-line-number">02</span><span className="export-keyword">target</span> <span>service / production</span></div><div><span className="export-line-number">03</span><span className="export-keyword">checks</span> <span>policy, schema, dependency</span></div><div><span className="export-line-number">04</span><span className="export-keyword">export</span> <span className="export-value">deployable backend</span></div></div><div className="export-panel-footer">Conceptual workflow · implementation in progress</div></div>
        </div>
      </section>

      <BuildOutputPreview />

      <section className="blueprint-section" id="pricing">
        <div className="container home-pricing-layout"><div><SectionHeading eyebrow="Pricing" title="Discuss your Developer License." description="Share your project and deployment needs with the BlueLizard team." /><p className="home-pricing-note">MVP target: December 3, 2026</p><Link className="text-link" href="/pricing">Explore the Developer License</Link></div><PricingCard compact /></div>
      </section>

      <section className="waitlist-banner" id="waitlist-signup"><div className="container waitlist-banner-inner"><div><Eyebrow>Early access</Eyebrow><h2>Design the next backend with us.</h2><p>BlueLizard MVP target: December 3, 2026. Join the waitlist for product updates and early access.</p></div><Link className="button-dark" href="/waitlist">Join the Waitlist</Link></div></section>

      <section className="blueprint-section faq-section" id="faq"><div className="container faq-grid"><div><Eyebrow>FAQ</Eyebrow><h2>Clear about what is real, planned, and next.</h2><p className="section-copy">The preview is intentionally honest: it shows the product direction without presenting the conceptual graph as a shipped editor.</p></div><div className="faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></div></section>

      <section className="blueprint-section founders-section" id="Founders" aria-labelledby="founders-heading">
        <div className="container">
          <div className="prose">
            <h2 id="founders-heading">Founders</h2>
            <div className="founder-grid">
              {founders.map(({ name, role, photo, linkedin }) => (
                <article className="founder-profile" key={name}>
                  <Image src={photo} alt={name} width={128} height={128} />
                  <div>
                    <h3>{name}</h3>
                    <p>{role}</p>
                    <a className="text-link founder-link" href={linkedin} aria-label={`${name} on LinkedIn`}>
                      LinkedIn <span className="text-link-arrow" aria-hidden="true">↗</span>
                    </a>
                  </div>
                </article>
              ))}
            </div>
            <p>For collaboration or inquiries for the BlueLizard founding team, <a href="/contact">get in touch</a>.</p>
          </div>
        </div>
      </section>

      <CTA title="Give your backend a shape before it has a codebase." description="Join the early access list and follow BlueLizard as visual blueprints become a new interface for backend infrastructure." actionLabel="Join the Waitlist" actionHref="/waitlist" />
    </>
  );
}
