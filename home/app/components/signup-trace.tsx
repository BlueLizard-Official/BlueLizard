"use client";

import { useEffect, useState } from "react";

const stages = [
  { label: "Receive request", detail: "POST /signup" },
  { label: "Validate input", detail: "Check the signup schema" },
  { label: "Check rate limit", detail: "Look up attempts in Redis" },
  { label: "Check identity and permissions", detail: "Resolve identity and evaluate OpenFGA policy" },
  { label: "Write account", detail: "Save to PostgreSQL" },
  { label: "Return response", detail: "201 Created" },
];

const rateLimitIndex = 2;

export function SignupTrace() {
  const [trace, setTrace] = useState<{ blocked: boolean; step: number } | null>(null);
  const end = trace?.blocked ? rateLimitIndex : stages.length - 1;

  useEffect(() => {
    if (!trace || trace.step >= end) return;
    const timer = window.setTimeout(() => {
      setTrace({ ...trace, step: trace.step + 1 });
    }, 420);
    return () => window.clearTimeout(timer);
  }, [trace, end]);

  function run(blocked: boolean) {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setTrace({ blocked, step: reducedMotion ? (blocked ? rateLimitIndex : stages.length - 1) : 0 });
  }

  const rejected = trace?.blocked && trace.step === rateLimitIndex;
  const finished = trace && trace.step === end;

  return (
    <section className="signup-trace" aria-labelledby="signup-trace-title">
      <div className="signup-trace-bar">
        <h2 id="signup-trace-title">signup.blueprint</h2>
        <span>Interactive demo</span>
      </div>
      <ol className="signup-trace-path">
        {stages.map(({ label, detail }, index) => {
          const visited = trace !== null && index <= trace.step;
          const stopped = rejected && index === rateLimitIndex;
          return (
            <li key={label} data-visited={visited} data-stopped={Boolean(stopped)} aria-current={trace?.step === index ? "step" : undefined}>
              <i aria-hidden="true" />
              <span><strong>{label}</strong><small>{stopped ? "429 Too Many Requests" : detail}</small></span>
            </li>
          );
        })}
      </ol>
      <div className="signup-trace-controls">
        <button type="button" className="button-primary" onClick={() => run(false)}>Trace signup</button>
        <button type="button" className="signup-trace-test" onClick={() => run(true)}>Test rate limit</button>
      </div>
      <p className="signup-trace-result" role="status">
        {finished
          ? rejected
            ? "429 Too Many Requests. The request stopped before the database write."
            : "201 Created. The sample account was saved."
          : trace ? "Tracing the sample request…" : "Choose a sample request to see how the blueprint handles it."}
      </p>
    </section>
  );
}
