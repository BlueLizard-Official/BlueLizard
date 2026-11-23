import { BuildOutputPreview } from "../components/build-output-preview";
import { CodeBlock } from "../components/code-block";
import { CTA, PageIntro, SectionHeading } from "../components/ui";
import { pageMetadata } from "../lib/metadata";

export const metadata = pageMetadata({ title: "CLI", description: "BlueLizard CLI overview, package identifier, executable, and clearly labeled evolving commands.", path: "/cli", image: "/og/cli.png", imageAlt: "BlueLizard CLI: Build and serve through a consistent workflow." });

export default function CLIPage() {
  return (
    <>
      <PageIntro eyebrow="Command line" title="BlueLizard CLI" description="A command-line interface for working with BlueLizard projects. The package identifier is @bluelizard/cli and the intended executable is lizard." />
      <section className="section">
        <div className="container stack-lg">
          <div className="feature-grid">
            <article className="feature-card"><div className="feature-card-number">PACKAGE</div><h3>@bluelizard/cli</h3><p>The npm package name associated with the project. Published availability is not verified in this repository.</p><div className="feature-card-footer"><span className="badge badge-planned">Verify before use</span></div></article>
            <article className="feature-card"><div className="feature-card-number">EXECUTABLE</div><h3>lizard</h3><p>The intended command-line executable for BlueLizard workflows.</p><div className="feature-card-footer"><span className="badge badge-in-progress">Evolving</span></div></article>
          </div>
          <SectionHeading eyebrow="Workflow examples" title="Commands shown with their current level of certainty." />
          <CodeBlock label="Build and serve" code={`lizard build\nlizard serve`} note="Intended workflow examples. Current availability and behavior require verification against the CLI source or published package." />
          <CodeBlock label="Proposed commands" code={`lizard init\nlizard dev\nlizard check\nlizard doctor`} note="Proposed commands shown separately from the core workflow; they are not presented as implemented." />
          <div className="prose"><h2>How to read this page</h2><p>The CLI surface is documented conservatively because the repository inspected for this site does not include a verifiable CLI package implementation. No flags, arguments, outputs, or installation guarantee are implied here.</p><p>As the project develops, this page can become the reference for actual command behavior, supported project files, exit codes, and diagnostics.</p></div>
        </div>
      </section>
      <BuildOutputPreview />
      <CTA title="Follow the CLI foundation work." description="The roadmap shows where project discovery, configuration handling, and command workflows fit into the wider system." actionLabel="View CLI roadmap items" actionHref="/roadmap" />
    </>
  );
}
