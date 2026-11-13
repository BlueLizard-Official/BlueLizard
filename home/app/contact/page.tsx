import type { Metadata } from "next";
import { CopyButton } from "../components/code-block";
import { PageIntro, SectionHeading } from "../components/ui";

export const metadata: Metadata = { title: "Contact", description: "Contact Blue Lizard for technical questions, project feedback, collaboration inquiries, or general communication.", alternates: { canonical: "/contact" } };

const email = "contact@bluelizard.sbs";

export default function ContactPage() {
  return <><PageIntro eyebrow="Contact" title="Contact Blue Lizard" description="For technical questions, project feedback, collaboration inquiries, or general communication, reach out by email." /><section className="section"><div className="container narrow-container stack-lg"><SectionHeading eyebrow="Primary contact" title="A direct line to the project." /><div className="email-card"><span className="email-address">{email}</span><div className="email-actions"><CopyButton value={email} label="Copy email" /><a className="button-primary" href={`mailto:${email}`}>Open email app <span aria-hidden="true">↗</span></a></div></div><div className="prose"><p>Blue Lizard is under active development. A response-time guarantee, support program, phone number, office address, and social accounts are not provided here.</p><p>When writing, including relevant technical context will make it easier to understand your question or feedback.</p></div></div></section></>;
}
