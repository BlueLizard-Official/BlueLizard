import { CopyButton } from "../components/code-block";
import { PageIntro, SectionHeading } from "../components/ui";
import { PHONE_DISPLAY, PHONE_HREF } from "../lib/contact";
import { pageMetadata } from "../lib/metadata";

export const metadata = pageMetadata({ title: "Contact", description: "Contact BlueLizard for technical questions, project feedback, collaboration inquiries, or general communication.", path: "/contact", image: "/og/contact.png", imageAlt: "BlueLizard Contact: Let's talk engineering." });

const email = "contact@bluelizard.sbs";

export default function ContactPage() {
  return <><PageIntro eyebrow="Contact" title="Contact BlueLizard" description="For technical questions, project feedback, collaboration inquiries, or general communication, reach out by email or phone." /><section className="section"><div className="container narrow-container stack-lg"><SectionHeading eyebrow="Primary contact" title="A direct line to the project." /><div className="email-card"><span className="email-address">{email}</span><div className="email-actions"><CopyButton value={email} label="Copy email" /><a className="button-primary" href={`mailto:${email}`}>Open email app <span aria-hidden="true">↗</span></a></div></div><div className="email-card"><span className="email-address">{PHONE_DISPLAY}</span><div className="email-actions"><a className="button-primary" href={PHONE_HREF}>Call BlueLizard</a></div></div><div className="prose"><p>BlueLizard is under active development.</p><p>When writing, including relevant technical context will make it easier to understand your question or feedback.</p></div></div></section></>;
}
