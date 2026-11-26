import { PageIntro, StatusPill } from "../components/ui";
import { WaitlistForm } from "../components/waitlist-form";
import { pageMetadata } from "../lib/metadata";

export const metadata = pageMetadata({
  title: "Join the BlueLizard waitlist.",
  description: "Join the BlueLizard early developer waitlist for MVP updates and early access to visual backend infrastructure.",
  path: "/waitlist",
  image: "/og/home.png",
  imageAlt: "Join the BlueLizard developer waitlist",
});

export default function WaitlistPage() {
  return (
    <>
      <PageIntro eyebrow="Early developer access" title="Put your backend on the map." description="Join the BlueLizard waitlist for MVP updates and early access to a new way to design, inspect, and build backend systems." />
      <section className="waitlist-page">
        <div className="container waitlist-layout">
          <aside className="waitlist-aside">
            <StatusPill tone="orange">MVP launching soon</StatusPill>
            <h2>Built for the people who already think in systems.</h2>
            <p>Tell us what you build, what your stack looks like, and where a visual backend blueprint would save you time.</p>
            <div className="waitlist-aside-list"><span>Private early-access updates</span><span>Developer-focused product feedback</span><span>No public list or directory</span></div>
          </aside>
          <WaitlistForm />
        </div>
      </section>
    </>
  );
}
