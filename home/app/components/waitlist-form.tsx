"use client";

import { FormEvent, useState } from "react";
import { DEVELOPMENT_ROLES, PREFERRED_AGENTS } from "../lib/waitlist-schema";

type FormState =
  | { readonly status: "idle" | "submitting" }
  | { readonly status: "success"; readonly message: string }
  | { readonly status: "duplicate" | "error"; readonly message: string; readonly fields?: Readonly<Record<string, string>> };

type ApiResponse = {
  readonly ok?: boolean;
  readonly message?: string;
  readonly fields?: Readonly<Record<string, string>>;
};

function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? <p className="waitlist-field-error" id={id} role="alert">{message}</p> : null;
}

export function WaitlistForm() {
  const [state, setState] = useState<FormState>({ status: "idle" });

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    setState({ status: "submitting" });
    const formData = new FormData(form);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      role: formData.get("role"),
      githubUrl: formData.get("githubUrl"),
      backendStack: formData.get("backendStack"),
      preferredAgent: formData.get("preferredAgent"),
      useCase: formData.get("useCase"),
      consent: formData.get("consent") === "on",
    };

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as ApiResponse;

      if (response.ok && result.ok) {
        form.reset();
        setState({
          status: "success",
          message: result.message ?? "You're on the list. We'll contact you with BlueLizard MVP updates.",
        });
        return;
      }

      if (response.status === 409) {
        setState({ status: "duplicate", message: result.message ?? "That email is already on the list.", fields: result.fields });
        return;
      }

      setState({ status: "error", message: result.message ?? "We couldn't submit your registration. Please try again.", fields: result.fields });
    } catch {
      setState({ status: "error", message: "We couldn't reach the waitlist service. Check your connection and try again." });
    }
  }

  if (state.status === "success") {
    return (
      <div className="waitlist-success" role="status" aria-live="polite">
        <span className="waitlist-success-mark" aria-hidden="true">✓</span>
        <p className="waitlist-form-kicker">Registration received</p>
        <h2>{state.message}</h2>
        <p>Your details are stored privately for BlueLizard launch communications. You can request deletion at any time from the privacy contact.</p>
        <button className="button-secondary" type="button" onClick={() => setState({ status: "idle" })}>Add another registration</button>
      </div>
    );
  }

  const fields = "fields" in state ? state.fields : undefined;
  const formMessage = state.status === "duplicate" || state.status === "error" ? state.message : undefined;

  return (
    <form className="waitlist-form" onSubmit={submit} noValidate aria-busy={state.status === "submitting"}>
      {formMessage ? <div className={`waitlist-form-message waitlist-form-message-${state.status}`} role="alert" aria-live="assertive">{formMessage}</div> : null}
      <div className="waitlist-form-heading"><div><p className="waitlist-form-kicker">Early developer access</p><h2>Tell us what you are building.</h2></div><span className="waitlist-required-note">* Required</span></div>

      <div className="waitlist-form-grid">
        <div className="waitlist-field waitlist-field-wide"><label htmlFor="waitlist-name">Full name <span aria-hidden="true">*</span></label><input id="waitlist-name" name="name" type="text" autoComplete="name" maxLength={100} required aria-invalid={Boolean(fields?.name)} aria-describedby={fields?.name ? "waitlist-name-error" : undefined} /> <FieldError id="waitlist-name-error" message={fields?.name} /></div>
        <div className="waitlist-field waitlist-field-wide"><label htmlFor="waitlist-email">Email address <span aria-hidden="true">*</span></label><input id="waitlist-email" name="email" type="email" autoComplete="email" maxLength={254} required aria-invalid={Boolean(fields?.email)} aria-describedby={fields?.email ? "waitlist-email-error" : undefined} /> <FieldError id="waitlist-email-error" message={fields?.email} /></div>
        <div className="waitlist-field"><label htmlFor="waitlist-role">Primary development role <span aria-hidden="true">*</span></label><select id="waitlist-role" name="role" required defaultValue="" aria-invalid={Boolean(fields?.role)} aria-describedby={fields?.role ? "waitlist-role-error" : undefined}><option value="" disabled>Select a role</option>{DEVELOPMENT_ROLES.map((role) => <option key={role} value={role}>{role}</option>)}</select><FieldError id="waitlist-role-error" message={fields?.role} /></div>
        <div className="waitlist-field"><label htmlFor="waitlist-agent">Preferred AI coding agent</label><select id="waitlist-agent" name="preferredAgent" defaultValue=""><option value="">Select an option</option>{PREFERRED_AGENTS.map((agent) => <option key={agent} value={agent}>{agent}</option>)}</select><FieldError id="waitlist-agent-error" message={fields?.preferredAgent} /></div>
        <div className="waitlist-field waitlist-field-wide"><label htmlFor="waitlist-github">GitHub profile URL <span className="waitlist-optional">Optional</span></label><input id="waitlist-github" name="githubUrl" type="url" autoComplete="url" maxLength={300} placeholder="https://github.com/you" aria-invalid={Boolean(fields?.githubUrl)} aria-describedby={fields?.githubUrl ? "waitlist-github-error" : undefined} /><FieldError id="waitlist-github-error" message={fields?.githubUrl} /></div>
        <div className="waitlist-field waitlist-field-wide"><label htmlFor="waitlist-stack">Current backend stack <span className="waitlist-optional">Optional</span></label><input id="waitlist-stack" name="backendStack" type="text" maxLength={160} placeholder="TypeScript, Postgres, Redis..." aria-invalid={Boolean(fields?.backendStack)} aria-describedby={fields?.backendStack ? "waitlist-stack-error" : undefined} /><FieldError id="waitlist-stack-error" message={fields?.backendStack} /></div>
        <div className="waitlist-field waitlist-field-full"><label htmlFor="waitlist-use-case">What would you build with BlueLizard? <span className="waitlist-optional">Optional</span></label><textarea id="waitlist-use-case" name="useCase" maxLength={1000} rows={5} placeholder="Tell us about the backend system you want to make clearer..." aria-invalid={Boolean(fields?.useCase)} aria-describedby={fields?.useCase ? "waitlist-use-case-error" : undefined} /><FieldError id="waitlist-use-case-error" message={fields?.useCase} /></div>
      </div>

      <label className={`waitlist-consent${fields?.consent ? " has-error" : ""}`}><input name="consent" type="checkbox" required aria-invalid={Boolean(fields?.consent)} aria-describedby={fields?.consent ? "waitlist-consent-error" : undefined} /><span>I agree to receive BlueLizard waitlist-related communications and MVP updates. <span aria-hidden="true">*</span></span></label>
      <FieldError id="waitlist-consent-error" message={fields?.consent} />
      <div className="waitlist-form-footer"><p>We store the information you choose to share for launch communications. No public directory, IP address, or user-agent fingerprint is created by this form.</p><button className="button-primary" type="submit" disabled={state.status === "submitting"}>{state.status === "submitting" ? "Joining..." : "Join the Waitlist"}</button></div>
    </form>
  );
}
