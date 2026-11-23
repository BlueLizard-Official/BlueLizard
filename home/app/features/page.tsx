import { CTA, PageIntro, SectionHeading } from "../components/ui";
import { InfrastructureDiagram } from "../components/infrastructure-diagram";
import { SecurityFeature } from "../components/security-feature";
import { pageMetadata } from "../lib/metadata";

export const metadata = pageMetadata({ title: "Security and infrastructure", description: "Explore BlueLizard's intended security-conscious backend architecture and configurable infrastructure modules.", path: "/features", image: "/og/features.png", imageAlt: "BlueLizard security-conscious backend architecture." });

const securityFeatures = [
  ["01", "Schema-based validation", "Represent request and configuration contracts explicitly, before untrusted input reaches application logic.", "Planned", "Planned blueprint capability; no general-purpose validation engine is claimed as available."],
  ["02", "Explicit authorization", "Keep access relationships and policy decisions visible as part of the backend graph.", "Planned", "OpenFGA is shown as an intended authorization integration, not a currently shipped provider."],
  ["03", "Authentication integration", "Separate identity verification from authorization so each boundary can be reviewed and configured.", "Planned", "The architecture direction distinguishes authentication from policy evaluation; provider support is evolving."],
  ["04", "Secure environment configuration", "Generate clear environment templates and keep secrets out of source, prompts, and generated logs.", "Planned", "Configuration guidance is a product direction, not a guarantee of secret safety by itself."],
  ["05", "Rate limiting", "Make abuse controls such as Redis-backed throttling explicit where an endpoint needs them.", "Planned", "Rate limiting is represented in conceptual blueprints; a universal limiter is not claimed as available."],
  ["06", "Secrets management guidance", "Surface the difference between configuration values, runtime secrets, and the systems that should hold them.", "Planned", "Guidance is planned; production secret storage remains an application and deployment responsibility."],
  ["07", "Service health checks", "Describe readiness, liveness, and service dependencies so operations are part of the generated shape.", "Planned", "Health-check output is an intended infrastructure capability, not a verified runtime feature."],
  ["08", "Production-oriented Docker output", "Aim for reproducible service definitions and Docker Compose configuration that developers can inspect and adapt.", "Planned", "Docker-oriented output is part of the direction; supported production targets are still being defined."],
] as const;

const items = [
  ["Blueprint-based backend representation", "Describe backend structure as a shared model of services, operations, and relationships. This addresses the gap between scattered source files and the system those files form.", "In progress", "The blueprint direction is part of the active project scope; exact syntax and persistence are evolving."],
  ["Typed nodes and connections", "Make important backend relationships explicit, so tools can reason about valid connections and the operations that pass between them.", "Planned", "The concept is defined at the product level; a verified public implementation is not available in this repository."],
  ["Intermediate representation and validation", "Create a validation boundary between a project description and later build steps, with room for structural and configuration checks.", "Planned", "Validation is a planned capability; no implementation claim is made here."],
  ["Backend build orchestration", "Coordinate the processing required to turn a structured backend project into a buildable application target.", "In progress", "The CLI-oriented build workflow is part of the evolving direction; supported targets are not yet documented as stable."],
  ["CLI workflows", "Give developers a direct command-line surface for working with BlueLizard projects.", "In progress", "The package name and executable are defined for the project, but publication and current command behavior require verification."],
  ["MCP integration", "Offer structured tools to compatible AI coding agents through a Model Context Protocol interface.", "Planned", "The integration is described as intended; no installation command is presented without verified implementation."],
  ["Security-oriented checks", "Help surface unsafe patterns, configuration issues, and authorization concerns earlier in the development workflow.", "Planned", "Security analysis is a planned direction, not a security guarantee or a completed scanner."],
  ["Runtime and serving workflows", "Provide a consistent way to start supported backend applications after the project has been processed.", "Planned", "Serving is part of the intended workflow; supported runtimes are not yet verified here."],
  ["Diagnostics and error reporting", "Return actionable context about configuration, build failures, and potential security problems.", "Planned", "Diagnostics are a design goal; the exact error format remains subject to change."],
  ["Future extensibility", "Keep the shared model open to additional backends, checks, integrations, and developer workflows over time.", "Planned", "Extensibility is a long-term principle rather than a claim about a current plugin system."],
] as const;

export default function FeaturesPage() {
  return (
    <>
      <PageIntro eyebrow="Security and infrastructure" title="Backends should show their boundaries." description="BlueLizard is being shaped as a security-conscious backend generation framework: a way to represent validation, identity, authorization, data, and operations as coherent infrastructure instead of leaving them implicit in generated source code." />

      <section className="section security-architecture-section">
        <div className="container">
          <SectionHeading eyebrow="Security philosophy" title="Security isn't a prompt. It's architecture." description="A prompt can ask for secure behavior, but a credible backend needs explicit places for identity, policy, validation, configuration, and service dependencies. Blueprints are intended to make those boundaries inspectable before build output is produced." />
          <InfrastructureDiagram />
          <div className="security-boundary-note"><strong>Authentication is not authorization.</strong><span>Authentication verifies identity. OpenFGA evaluates access relationships and policies. OpenFGA is not an authentication provider.</span></div>
        </div>
      </section>

      <section className="section section-bordered security-feature-section">
        <div className="container">
          <SectionHeading eyebrow="Security-oriented modules" title="Compose the controls your application needs." description="These are intended modules, not a claim that every service must be bundled, self-hosted, or enabled for every project." />
          <div className="security-feature-grid">{securityFeatures.map(([number, title, description, status, implementationNote]) => <SecurityFeature key={title} number={number} title={title} description={description} status={status} implementationNote={implementationNote} />)}</div>
        </div>
      </section>

      <section className="section infrastructure-output-section">
        <div className="container infrastructure-output-grid">
          <div><SectionHeading eyebrow="Reproducible infrastructure" title="Generate the shape, then adapt the deployment." description="BlueLizard aims to produce reproducible infrastructure configurations: Docker Compose configuration, service definitions, and environment templates that can be reviewed, versioned, and adjusted for the target environment." /></div>
          <div className="infrastructure-output-panel"><div><span>blueprint output</span><span className="output-panel-status">planned</span></div><ul><li>docker-compose.yml</li><li>service definitions</li><li>.env.example template</li><li>health checks + dependencies</li></ul><p>Modules remain configurable according to application needs. The generator should make choices visible, not force one deployment model.</p></div>
        </div>
      </section>

      <section className="section section-bordered">
        <div className="container">
          <SectionHeading eyebrow="Technical feature map" title="Intended capabilities, described precisely." description="The status beside each capability is conservative. Planned architecture is not the same as a verified production feature." />
          <div className="technical-list">{items.map(([title, purpose, status, implementation]) => <article className="technical-item" key={title}><h3>{title}</h3><p>{purpose}</p><div className="technical-meta"><span className={`badge ${status === "In progress" ? "badge-in-progress" : "badge-planned"}`}>{status}</span><span>{implementation}</span></div></article>)}</div>
          <p className="liorandb-boundary-note"><strong>Database boundary:</strong> LioranDB is not described as a drop-in PostgreSQL replacement. The MongoDB-oriented LioranDB driver is not used as a PostgreSQL transport; BlueLizard should keep those database choices explicit.</p>
        </div>
      </section>

      <section className="section security-philosophy-section">
        <div className="container security-philosophy"><span className="blueprint-kicker">Security philosophy</span><h2>Secure defaults reduce mistakes but do not guarantee a vulnerability-free backend.</h2><p>Generated infrastructure still needs review, updates, threat modeling, operational monitoring, and responsible deployment decisions.</p></div>
      </section>

      <CTA title="Track the implementation as it evolves." description="The roadmap separates foundation work from longer-term security and infrastructure capabilities, and only verified items should be treated as available." actionLabel="Open development roadmap" actionHref="/roadmap" />
    </>
  );
}
