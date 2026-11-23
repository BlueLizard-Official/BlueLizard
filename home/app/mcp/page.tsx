import { AgentIntegrationCard } from "../components/agent-integration-card";
import { MCPWorkflow } from "../components/mcp-workflow";
import { CTA, Eyebrow, PageIntro, SectionHeading } from "../components/ui";
import { MCP_PAGE_DESCRIPTION, MCP_PAGE_METADATA } from "../lib/metadata";

export const metadata = MCP_PAGE_METADATA;

const integrations = [
  ["OpenAI Codex", "A planned MCP target for agents that can inspect and propose changes to backend blueprints."],
  ["Google Antigravity", "A planned integration target; availability will follow verified protocol support."],
  ["Cursor", "A planned integration target for structured, inspectable backend changes."],
  ["Other MCP-compatible coding agents", "Additional targets can be evaluated as the protocol surface becomes real and documented."],
] as const;

const capabilities = [
  "Discover node types",
  "Read blueprint schemas",
  "Create nodes",
  "Connect nodes",
  "Update node configuration",
  "Inspect project graphs",
  "Validate graph structure",
  "Request compilation",
  "Inspect diagnostics",
] as const;

const controlPrinciples = [
  ["AI agent proposes changes", "The agent turns a developer request into a bounded proposal."],
  ["Blueprint captures the structure", "Nodes, sockets, dependencies, and configuration stay inspectable."],
  ["Validator identifies violations", "Checks can surface missing connections, invalid types, or policy gaps."],
  ["Compiler produces deployable code", "A validated graph becomes input to the intended build workflow."],
  ["Developer retains control", "People review the model and approve the change before it moves forward."],
] as const;

export default function MCPPage() {
  return (
    <>
      <PageIntro eyebrow="Model Context Protocol" title="Your AI agent. Our blueprints." description={MCP_PAGE_DESCRIPTION} />

      <section className="mcp-section mcp-section-intro">
        <div className="container">
          <div className="mcp-intro-grid">
            <div>
              <Eyebrow>From code generation to system design</Eyebrow>
              <h2>Give the agent a structure it can reason about.</h2>
              <p>Instead of asking an AI agent to generate an entire backend as plain code, let it construct explicit backend blueprints that can be inspected, edited and compiled.</p>
              <p className="mcp-disclaimer">The MCP server, tool surface, and integrations shown here are planned concepts for the BlueLizard product direction. No public MCP server is available yet.</p>
            </div>
            <div className="mcp-intro-aside"><span className="mcp-aside-number">01</span><strong>Agent proposes.</strong><span>Blueprint makes it legible.</span></div>
          </div>
          <MCPWorkflow />
        </div>
      </section>

      <section className="mcp-section mcp-section-soft">
        <div className="container">
          <SectionHeading eyebrow="Integration targets" title="Compatible agents, accurately labeled." description="These are intended targets, not shipped integrations. Each status reflects the current repository: the MCP surface is described as a future direction, with no public server implementation to configure today." />
          <div className="agent-integration-grid">{integrations.map(([name, description]) => <AgentIntegrationCard key={name} name={name} description={description} status="Planned" />)}</div>
        </div>
      </section>

      <section className="mcp-section">
        <div className="container">
          <SectionHeading eyebrow="The control loop" title="A clear boundary between proposal and production." description="The point of MCP is not to remove developer judgment. It is to give that judgment a better surface." />
          <div className="mcp-control-grid">{controlPrinciples.map(([title, description], index) => <article className="mcp-control-card" key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{description}</p></article>)}</div>
        </div>
      </section>

      <section className="mcp-section mcp-section-dark">
        <div className="container mcp-tools-grid">
          <div>
            <Eyebrow>Planned blueprint capabilities</Eyebrow>
            <h2>A tool surface designed around structure.</h2>
            <p>These capabilities describe the intended interaction model. They are not an implemented public API, and there are no installation commands or MCP configuration values to provide yet.</p>
            <div className="mcp-capability-list">{capabilities.map((capability, index) => <div key={capability}><span>0{index + 1}</span><strong>{capability}</strong></div>)}</div>
          </div>
          <div className="mcp-json-card">
            <div className="mcp-json-header"><span>illustrative tool call</span><span>not public API</span></div>
            <pre><code>{`{
  "tool": "blueprint.create_node",
  "arguments": {
    "type": "rate_limit",
    "config": {
      "store": "redis",
      "window": "60s"
    }
  }
}`}</code></pre>
            <p>Example representation only. It does not describe an available endpoint, command, or configuration value.</p>
          </div>
        </div>
      </section>

      <CTA title="Help shape the agent workflow." description="Join the MVP waitlist for updates as BlueLizard moves from conceptual blueprints toward a verified, developer-controlled product surface." actionLabel="Join MVP Waitlist" actionHref="/waitlist" />
    </>
  );
}
