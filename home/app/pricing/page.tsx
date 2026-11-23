import { PricingCard } from "../components/pricing-card";
import { CTA, Eyebrow, PageIntro, SectionHeading } from "../components/ui";
import { PRICING_PAGE_METADATA } from "../lib/metadata";

export const metadata = PRICING_PAGE_METADATA;

const faqs = [
  ["Is BlueLizard available now?", "No. The planned MVP target is December 3, 2026. You can contact us now about licensing."],
  ["What does the Developer License cover?", "The planned Developer License is intended to cover the BlueLizard product capabilities listed on this page. Exact scope and commercial terms may evolve before public availability."],
  ["Will generated code remain accessible?", "The product direction is that generated code belongs to the developer and remains accessible as a project artifact. The final license terms will define the public commercial details."],
  ["Can I host the backend on my own VPS?", "Yes, self-hosting on a developer-controlled VPS is part of the intended workflow. Deployment still requires your own configuration, TLS, backups, secrets management, updates, and operator review."],
  ["Is AI/MCP support included in the roadmap?", "Yes. MCP agent integration is part of the planned capability set, alongside visual blueprints, validation, generation, and infrastructure output. It is not represented as available today."],
] as const;

export default function PricingPage() {
  return (
    <>
      <PageIntro eyebrow="Pricing" title="Developer License pricing on consultation." description="Talk with BlueLizard about your project, deployment needs, and licensing options." />

      <section className="pricing-page-section">
        <div className="container">
          <div className="pricing-page-intro"><div><Eyebrow>BlueLizard / Developer License</Eyebrow><h2>Own the output. Operate the backend.</h2><p>The planned license is designed for developers who want visual backend blueprints, generated artifacts, and the freedom to deploy those artifacts on infrastructure they control.</p></div><div className="pricing-mvp-target"><span>MVP target</span><strong>December 3, 2026</strong></div></div>
          <div className="pricing-page-grid"><PricingCard /><aside className="pricing-preview-aside"><div className="pricing-preview-aside-mark" aria-hidden="true">+</div><h3>Pre-launch by design.</h3><p>No payment gateway, checkout flow, or card collection is implemented. Join the waitlist to receive updates as the release plan becomes concrete.</p><div className="pricing-preview-aside-rule" /><span>Pricing on consultation</span></aside></div>
        </div>
      </section>

      <section className="section section-bordered pricing-faq-section">
        <div className="container pricing-faq-grid"><SectionHeading eyebrow="Pricing FAQ" title="Clear about what is planned." description="Commercial details remain intentionally narrow until the product and release scope are ready for public availability." /><div className="faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></div>
      </section>

      <CTA title="Get the release updates." description="The waitlist is the path to MVP news and early-access information. It does not create a paid subscription or reserve a purchase." actionLabel="Join the Waitlist" actionHref="/waitlist" />
    </>
  );
}
