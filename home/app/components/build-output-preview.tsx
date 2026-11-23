"use client";

import { useState, type KeyboardEvent } from "react";
import { CodeBlock, type CodeLanguage } from "./code-block";

const projectStructure = `build/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── auth/
│   ├── users/
│   └── policies/
├── prisma/
│   └── schema.prisma
├── Dockerfile
├── compose.yaml
├── .env.example
├── package.json
└── README.md`;

const dockerCompose = `services:
  api:
    build:
      context: .
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      DATABASE_URL: \${DATABASE_URL:?set DATABASE_URL}
      REDIS_URL: \${REDIS_URL:?set REDIS_URL}
      AUTH_SECRET: \${AUTH_SECRET:?set AUTH_SECRET}
      OPENFGA_API_URL: \${OPENFGA_API_URL:-http://openfga:8080}
      OPENFGA_STORE_ID: \${OPENFGA_STORE_ID:?set OPENFGA_STORE_ID}
      OPENFGA_MODEL_ID: \${OPENFGA_MODEL_ID:?set OPENFGA_MODEL_ID}
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
      openfga:
        condition: service_healthy
    networks: [backend]
    healthcheck:
      test: ["CMD-SHELL", "node -e \\\"fetch('http://localhost:3000/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))\\\""]
      interval: 10s
      timeout: 5s
      retries: 5

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: app
      POSTGRES_USER: app
      POSTGRES_PASSWORD: \${POSTGRES_PASSWORD:?set POSTGRES_PASSWORD}
    volumes: [postgres_data:/var/lib/postgresql/data]
    networks: [backend]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app -d app"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    command: ["redis-server", "--appendonly", "yes"]
    volumes: [redis_data:/data]
    networks: [backend]
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  openfga:
    image: openfga/openfga:latest
    command: run
    environment:
      OPENFGA_DATASTORE_ENGINE: postgres
      OPENFGA_DATASTORE_URI: \${OPENFGA_DATASTORE_URI:?set OPENFGA_DATASTORE_URI}
      OPENFGA_LOG_FORMAT: json
    depends_on:
      postgres:
        condition: service_healthy
    networks: [backend]
    healthcheck:
      test: ["CMD-SHELL", "wget -qO- http://localhost:8080/healthz || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 5

networks:
  backend:

volumes:
  postgres_data:
  redis_data:`;

const environmentExample = `# Developer supplies and manages these values.
DATABASE_URL=postgresql://app:<password>@postgres:5432/app
REDIS_URL=redis://redis:6379
AUTH_SECRET=<generate-a-long-random-secret>
OPENFGA_API_URL=http://openfga:8080
OPENFGA_STORE_ID=<created-store-id>
OPENFGA_MODEL_ID=<created-model-id>
POSTGRES_PASSWORD=<set-a-strong-password>
OPENFGA_DATASTORE_URI=postgres://app:<password>@postgres:5432/app?sslmode=disable`;

const generatedApi = `import { Body, Controller, Post } from "@nestjs/common";
import { IsEmail, IsString, Length } from "class-validator";

export class CreateUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  @Length(1, 120)
  name!: string;
}

@Controller("users")
export class UsersController {
  constructor(
    private readonly policy: OpenFgaPolicy,
    private readonly users: UsersService,
  ) {}

  @Post()
  async create(
    @CurrentPrincipal() principal: Principal,
    @Body(new ValidationPipe({ whitelist: true })) input: CreateUserDto,
  ) {
    // Authentication established principal; policy evaluates access.
    await this.policy.assertCanCreateUser(principal, input.email);
    return this.users.create(input);
  }
}`;

const tabs = [
  { id: "structure", label: "Project Structure", language: "tree" as CodeLanguage, code: projectStructure, note: "Example artifact: the intended build output keeps application code, persistence, infrastructure, and operator documentation together." },
  { id: "compose", label: "Docker Compose", language: "yaml" as CodeLanguage, code: dockerCompose, note: "Illustrative configuration only. Health-gated dependencies reduce startup races, but production readiness still requires operator review." },
  { id: "environment", label: "Environment", language: "env" as CodeLanguage, code: environmentExample, note: "Placeholders only. Developers supply secrets and should use an appropriate secret-management process for deployment." },
  { id: "api", label: "Generated API", language: "typescript" as CodeLanguage, code: generatedApi, note: "Conceptual NestJS output showing schema validation and a separate authorization boundary; actual compiler output is not available yet." },
] as const;

const pipeline = ["Visual Blueprint", "Graph Validation", "NestJS Code Generation", "Docker Configuration", "Deploy to Your VPS"] as const;

export function BuildOutputPreview() {
  const [activeId, setActiveId] = useState<(typeof tabs)[number]["id"]>("structure");
  const activeTab = tabs.find((tab) => tab.id === activeId) ?? tabs[0];

  function selectTab(id: (typeof tabs)[number]["id"]) {
    setActiveId(id);
  }

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const currentIndex = tabs.findIndex((tab) => tab.id === activeId);
    let nextIndex = currentIndex;
    if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % tabs.length;
    if (event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = tabs.length - 1;
    if (nextIndex !== currentIndex) {
      event.preventDefault();
      selectTab(tabs[nextIndex].id);
      document.getElementById(`build-output-tab-${tabs[nextIndex].id}`)?.focus();
    }
  }

  return (
    <section className="build-output-section" id="build-output" aria-labelledby="build-output-title">
      <div className="container">
        <div className="build-output-heading">
          <div>
            <p className="eyebrow">Compiler direction</p>
            <h2 id="build-output-title">From blueprint to deployable backend.</h2>
            <p className="build-output-lede">Your backend. Your code. Your infrastructure.</p>
          </div>
          <p className="build-output-description">Blue Lizard aims to turn an inspectable blueprint into artifacts developers can own, review, adapt, and deploy to their own VPS. These previews are examples until actual compiler output is available.</p>
        </div>

        <div className="build-output-pipeline" aria-label="Conceptual backend compilation pipeline">
          {pipeline.map((step, index) => <div className="build-output-pipeline-step" key={step}><span>{step}</span>{index < pipeline.length - 1 ? <i aria-hidden="true">↓</i> : null}</div>)}
        </div>

        <div className="build-output-workspace">
          <div className="build-output-workspace-bar"><span>build/preview</span><span>example artifacts · not compiler output</span></div>
          <div className="build-output-tabs" role="tablist" aria-label="Example build output artifacts">
            {tabs.map((tab) => <button id={`build-output-tab-${tab.id}`} aria-controls={`build-output-panel-${tab.id}`} aria-selected={activeId === tab.id} className={activeId === tab.id ? "is-active" : ""} key={tab.id} role="tab" tabIndex={activeId === tab.id ? 0 : -1} type="button" onClick={() => selectTab(tab.id)} onKeyDown={handleTabKeyDown}>{tab.label}</button>)}
          </div>
          <div className="build-output-panel" id={`build-output-panel-${activeTab.id}`} role="tabpanel" aria-labelledby={`build-output-tab-${activeTab.id}`}>
            <CodeBlock code={activeTab.code} label={activeTab.label} language={activeTab.language} note={activeTab.note} />
          </div>
        </div>

        <div className="build-output-ownership"><div><span className="blueprint-kicker">Infrastructure ownership</span><h3>Deploy the generated output where you operate.</h3></div><p>Blue Lizard is intended to produce portable artifacts for your own VPS or deployment environment, rather than forcing you into Blue Lizard hosting. Reliability still depends on environment configuration, TLS, backups, secrets management, updates, monitoring, and operator review.</p></div>
      </div>
    </section>
  );
}
