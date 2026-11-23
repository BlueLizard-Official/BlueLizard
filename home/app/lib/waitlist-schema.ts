export const WAITLIST_CONSENT_VERSION = "2026-11-23";
export const WAITLIST_SOURCE = "website-waitlist" as const;

export const DEVELOPMENT_ROLES = [
  "Backend Developer",
  "Full Stack Developer",
  "AI Engineer",
  "Indie Hacker / Founder",
  "Student",
  "Other",
] as const;

export const PREFERRED_AGENTS = [
  "OpenAI Codex",
  "Google Antigravity",
  "Cursor",
  "Claude Code",
  "Other",
  "None yet",
] as const;

export type DevelopmentRole = (typeof DEVELOPMENT_ROLES)[number];
export type PreferredAgent = (typeof PREFERRED_AGENTS)[number];

export type WaitlistSubmission = {
  readonly name: string;
  readonly email: string;
  readonly role: DevelopmentRole;
  readonly githubUrl?: string;
  readonly backendStack?: string;
  readonly preferredAgent?: PreferredAgent;
  readonly useCase?: string;
  readonly consentVersion: string;
  readonly consentTimestamp: string;
  readonly source: typeof WAITLIST_SOURCE;
};

export type WaitlistValidationErrors = Readonly<Record<string, string>>;

export type WaitlistValidationResult =
  | { readonly ok: true; readonly data: WaitlistSubmission }
  | { readonly ok: false; readonly errors: WaitlistValidationErrors };

const FIELD_LIMITS = {
  name: 100,
  email: 254,
  backendStack: 160,
  useCase: 1_000,
} as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_KEYS = new Set([
  "name",
  "email",
  "role",
  "githubUrl",
  "backendStack",
  "preferredAgent",
  "useCase",
  "consent",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function cleanText(value: unknown, field: string, maxLength: number, errors: Record<string, string>): string | undefined {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  if (typeof value !== "string") {
    errors[field] = "This field must be text.";
    return undefined;
  }

  const cleaned = value.trim().replace(/\s+/g, " ");
  if (cleaned.length > maxLength) {
    errors[field] = `This field must be ${maxLength} characters or fewer.`;
    return undefined;
  }

  return cleaned || undefined;
}

function requiredText(value: unknown, field: string, label: string, maxLength: number, errors: Record<string, string>): string | undefined {
  const cleaned = cleanText(value, field, maxLength, errors);
  if (!cleaned && !errors[field]) {
    errors[field] = `${label} is required.`;
  }
  return cleaned;
}

function isOneOf<T extends readonly string[]>(value: unknown, values: T): value is T[number] {
  return typeof value === "string" && values.includes(value);
}

function normalizeGithubUrl(value: unknown, errors: Record<string, string>): string | undefined {
  const cleaned = cleanText(value, "githubUrl", 300, errors);
  if (!cleaned) {
    return undefined;
  }

  try {
    const parsed = new URL(cleaned);
    const hostname = parsed.hostname.toLowerCase();
    const pathParts = parsed.pathname.split("/").filter(Boolean);

    if (
      parsed.protocol !== "https:" ||
      !["github.com", "www.github.com"].includes(hostname) ||
      pathParts.length !== 1 ||
      parsed.username ||
      parsed.password ||
      parsed.search ||
      parsed.hash
    ) {
      errors.githubUrl = "Enter a public HTTPS GitHub profile URL.";
      return undefined;
    }

    return `https://github.com/${pathParts[0]}`;
  } catch {
    errors.githubUrl = "Enter a valid GitHub profile URL.";
    return undefined;
  }
}

export function validateWaitlistSubmission(input: unknown): WaitlistValidationResult {
  if (!isRecord(input)) {
    return { ok: false, errors: { form: "Submit a valid JSON object." } };
  }

  const errors: Record<string, string> = {};
  for (const key of Object.keys(input)) {
    if (!ALLOWED_KEYS.has(key)) {
      errors.form = "The submission contains an unsupported field.";
      break;
    }
  }

  const name = requiredText(input.name, "name", "Full name", FIELD_LIMITS.name, errors);
  const rawEmail = requiredText(input.email, "email", "Email address", FIELD_LIMITS.email, errors);
  const email = rawEmail?.toLowerCase();

  if (email && (!EMAIL_PATTERN.test(email) || email.length > FIELD_LIMITS.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!isOneOf(input.role, DEVELOPMENT_ROLES)) {
    errors.role = "Select a primary development role.";
  }

  const githubUrl = normalizeGithubUrl(input.githubUrl, errors);
  const backendStack = cleanText(input.backendStack, "backendStack", FIELD_LIMITS.backendStack, errors);
  const useCase = cleanText(input.useCase, "useCase", FIELD_LIMITS.useCase, errors);

  let preferredAgent: PreferredAgent | undefined;
  if (input.preferredAgent !== undefined && input.preferredAgent !== "") {
    if (!isOneOf(input.preferredAgent, PREFERRED_AGENTS)) {
      errors.preferredAgent = "Select a valid AI coding agent option.";
    } else {
      preferredAgent = input.preferredAgent;
    }
  }

  if (input.consent !== true) {
    errors.consent = "Consent is required to join the waitlist.";
  }

  if (Object.keys(errors).length > 0 || !name || !email || !isOneOf(input.role, DEVELOPMENT_ROLES)) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    data: {
      name,
      email,
      role: input.role,
      ...(githubUrl ? { githubUrl } : {}),
      ...(backendStack ? { backendStack } : {}),
      ...(preferredAgent ? { preferredAgent } : {}),
      ...(useCase ? { useCase } : {}),
      consentVersion: WAITLIST_CONSENT_VERSION,
      consentTimestamp: new Date().toISOString(),
      source: WAITLIST_SOURCE,
    },
  };
}
