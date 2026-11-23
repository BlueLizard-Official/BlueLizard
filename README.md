
<div align="center">

<img src="./home/public/logo.png" alt="BlueLizard" width="130" />

# BlueLizard

### Design visually. Build with code. Ship with confidence.

**A visual backend framework for the AI-assisted development era.**

[Website](https://bluelizard.sbs) · [GitHub](https://github.com/UltronTheAI/BlueLizard) · [Feedback](https://github.com/UltronTheAI/BlueLizard/issues) · [Contact](mailto:contact@bluelizard.sbs)

<br />

![Status](https://img.shields.io/badge/status-in%20development-black?style=flat-square)
![TypeScript](https://img.shields.io/badge/language-TypeScript-black?style=flat-square)
![Architecture](https://img.shields.io/badge/approach-visual%20blueprints-black?style=flat-square)

</div>

---

## What is BlueLizard?

**BlueLizard is an upcoming visual backend development framework that connects graphical programming with production-oriented TypeScript code generation.**

Backend development is becoming faster with AI coding agents. But generating code is only one part of building reliable software.

Developers still need to reason about architecture, authentication, authorization, data flow, validation, security, and deployment.

BlueLizard is being designed to make these systems easier to understand, construct, inspect, and maintain.

The vision is straightforward:

> Build backends visually without losing the power, flexibility, and ownership of real code.

Inspired by node-based programming environments such as Unreal Engine Blueprints, BlueLizard aims to bring a visual programming workflow to backend engineering.

This project is currently in its early development and research stage.

## The Problem

AI-assisted development has changed how software is written.

Developers can generate API routes, database models, authentication logic, and entire backend services from natural-language instructions.

However, generated code still requires careful review.

Common challenges include:

- Understanding complex AI-generated architectures.
- Maintaining consistent authentication and authorization.
- Identifying insecure or incorrect business logic.
- Managing relationships between APIs, services, and databases.
- Keeping generated code understandable and maintainable.
- Moving from a working prototype to a reliable deployment.

**Generating code is easy. Understanding and trusting the resulting system is harder.**

BlueLizard is an exploration of how visual programming, explicit architecture, and code generation can address these challenges.

## The Vision

BlueLizard is designed around three principles.

### 01. Visual by Design

Represent backend components as interconnected nodes.

Developers should be able to understand how requests, services, data, and business logic move through their applications.

### 02. Code Without Lock-in

Visual development should not mean hiding implementation details.

The planned compiler will generate readable TypeScript backend projects using NestJS.

Developers should be able to inspect, modify, test, and deploy their generated source code independently.

### 03. AI-Assisted, Developer-Controlled

AI agents should help developers design and modify systems without becoming an opaque source of truth.

The proposed blueprint representation will provide a structured interface for both human developers and AI coding agents.

The developer remains responsible for reviewing and validating the system.

---

## How BlueLizard Is Intended to Work

```text
          DEVELOPER / AI AGENT
                   |
                   v
        +---------------------+
        |  BLUEPRINT EDITOR   |
        |                     |
        |  APIs / FUNCTIONS   |
        |  AUTH / DATABASE    |
        |  SERVICES / STORAGE |
        +---------------------+
                   |
                   v
        +---------------------+
        | BLUEPRINT DEFINITION|
        |    YAML / GRAPH     |
        +---------------------+
                   |
                   v
        +---------------------+
        |  BlueLizard ENGINE |
        |                     |
        |  Validation         |
        |  Graph Analysis     |
        |  Code Generation    |
        +---------------------+
                   |
                   v
        +---------------------+
        |   NESTJS BACKEND    |
        |                     |
        |   TypeScript        |
        |   Prisma            |
        |   PostgreSQL        |
        |   Authentication    |
        +---------------------+
                   |
                   v
         BUILD / TEST / DEPLOY
```

*Conceptual architecture. The compiler and visual framework are planned components, not currently released functionality.*

## Planned Capabilities

| Capability | Description |
| :--- | :--- |
| Visual programming | Design backend functionality using connected nodes. |
| Blueprint definitions | Represent application behavior using structured, versionable files. |
| TypeScript generation | Generate inspectable NestJS application source code. |
| API design | Model endpoints, request handling, validation, and responses. |
| Database integration | Plan data access using Prisma and PostgreSQL. |
| Authentication | Integrate open-source authentication components. |
| Storage | Support object storage through an S3-compatible system such as MinIO. |
| Security | Provide patterns for authorization, validation, and rate limiting. |
| AI integration | Expose structured tools and context through a planned MCP server. |
| Deployment | Produce deployable backend projects with container configuration. |

These are design goals and are subject to change as the framework evolves.

## Planned Developer Workflow

The intended CLI package is `@bluelizard/cli`.

The proposed commands are:

| Command | Purpose |
| :--- | :--- |
| `lizard init` | Initialize a new backend blueprint project. |
| `lizard serve` | Start the local visual blueprint editor and viewer. |
| `lizard build` | Validate and compile blueprints into backend source code. |
| `lizard deploy` | Connect a project to supported deployment infrastructure. |

**Note:** These commands describe the planned developer experience. They are not installation instructions and should not be assumed to work in the current repository.

### Example Workflow

```text
Create a BlueLizard project
           |
           v
Define APIs and services
           |
           v
Connect blueprint nodes
           |
           v
Validate the architecture
           |
           v
Generate NestJS source code
           |
           v
Review and test the backend
           |
           v
Deploy to infrastructure
```

## Proposed Technology Stack

BlueLizard is exploring the following technologies:

| Layer | Technology |
| :--- | :--- |
| Generated backend | NestJS / TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | Open-source authentication provider |
| Object storage | MinIO / S3-compatible storage |
| Deployment | Docker |
| AI integration | Model Context Protocol (MCP) |
| Blueprint format | YAML-based graph representation |
| Visual editor | Node-based graphical interface |

The final architecture may evolve through prototyping, benchmarks, and developer feedback.

---

## Project Status

**Early Development / Architecture Research**

BlueLizard is not currently a production-ready backend framework.

The repository currently includes the BlueLizard website. The blueprint compiler, runtime tooling, and visual backend editor remain planned development work.

There is currently no public stable framework release.

We are using this stage to validate the architecture and understand the problems developers face when creating backends with or without AI tools.

### Roadmap

- [x] Establish project identity and initial website.
- [x] Define the initial product direction.
- [ ] Finalize blueprint graph specifications.
- [ ] Design node types and connection rules.
- [ ] Implement blueprint validation.
- [ ] Develop the initial compiler.
- [ ] Generate a minimal NestJS backend.
- [ ] Prototype the visual editor.
- [ ] Integrate database and authentication modules.
- [ ] Explore bidirectional code and blueprint workflows.
- [ ] Prototype MCP integration.
- [ ] Implement build and deployment workflows.
- [ ] Conduct developer testing and security reviews.
- [ ] Release the first public developer preview.

Roadmap items represent goals rather than release commitments.

## Repository Structure

```text
BlueLizard/
|
+-- home/
|   +-- app/             # Next.js website
|   +-- public/          # Website assets
|   +-- scripts/         # Website utilities
|   +-- package.json
|   +-- README.md
|
+-- README.md            # Project overview
```

Future framework modules will be documented here as they are added.

## Running the Website Locally

The existing website is built using Next.js.

### Requirements

- Node.js compatible with the project's Next.js version
- npm

### Development

```bash
git clone https://github.com/UltronTheAI/BlueLizard.git

cd BlueLizard/home

npm ci

npm run dev
```

Open `http://localhost:3000` in your browser.

### Production Build

```bash
npm run build
npm run start
```

These commands run the website, not the planned BlueLizard backend framework.

---

## Help Shape BlueLizard

We are actively exploring how developers work with AI-generated backend code.

We are particularly interested in feedback from developers using:

- Cursor, Codex, or other AI coding agents.
- NestJS, Express, or other Node.js backend frameworks.
- PostgreSQL and relational databases.
- Authentication, authorization, and API security systems.
- Infrastructure and deployment tooling.

### Questions We Are Exploring

**01.** What is the most frustrating part of maintaining an AI-generated backend?

**02.** How do you verify that generated authentication and authorization logic is correct?

**03.** Would a visual representation of backend logic help you understand and review a codebase?

**04.** Would you prefer editing visual blueprints, TypeScript code, or both?

**05.** What would make you trust a generated backend in a production environment?

Your feedback can help shape the architecture before the framework reaches its first release.

**[Share feedback or propose an idea](https://github.com/UltronTheAI/BlueLizard/issues/new)**

## Contributing

BlueLizard is currently in its initial development phase.

Architectural feedback, technical discussions, bug reports, documentation improvements, and developer experience suggestions are welcome.

Before proposing substantial changes, please open an issue to discuss the idea.

As the framework matures, we plan to provide dedicated contributor documentation and development guidelines.

## Security

Security is a central design consideration for BlueLizard.

However, generated code must not be considered secure solely because it was produced by a framework or AI agent.

Every generated application should undergo appropriate code review, testing, dependency auditing, and security validation before production deployment.

For potentially sensitive security reports, please avoid publishing exploit details in public issues.

Contact: **contact@bluelizard.sbs**

## License

No open-source license has been assigned to this repository yet.

Until an explicit license is added, the repository remains subject to applicable copyright restrictions.

The licensing approach for the website and future framework components will be documented separately.

---

## Contact

**BlueLizard**

Website: https://bluelizard.sbs

Email: contact@bluelizard.sbs

Repository: https://github.com/UltronTheAI/BlueLizard

For technical discussions, potential collaborations, and early developer feedback, reach out through email or GitHub Issues.

---

<div align="center">

### Build systems you can understand.

**BlueLizard**

Visual backend engineering for the next generation of developers.

[bluelizard.sbs](https://bluelizard.sbs)

<sub>Designed with clarity. Built for developers.</sub>

</div>
