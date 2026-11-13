/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("node:fs");
const path = require("node:path");
const sharp = require("sharp");

const WIDTH = 1200;
const HEIGHT = 630;
const ROOT = path.resolve(__dirname, "..");
const OUTPUT_DIR = path.join(ROOT, "public", "og");
const logoData = fs.readFileSync(path.join(ROOT, "public", "logo.png")).toString("base64");

const C = {
  canvas: "#f7f7f4",
  canvasSoft: "#fafaf7",
  surface: "#ffffff",
  ink: "#26251e",
  body: "#5a5852",
  muted: "#807d72",
  hairline: "#e6e5e0",
  hairlineStrong: "#cfcdc4",
  primary: "#f54e00",
  thinking: "#dfa88f",
  grep: "#9fc9a2",
  read: "#9fbbe0",
  edit: "#c0a8dd",
  done: "#c08532",
};

const FONT = "'CursorGothic', system-ui, 'Helvetica Neue', Helvetica, Arial, sans-serif";
const MONO = "'JetBrains Mono', 'Fira Code', monospace";
const logoHref = `data:image/png;base64,${logoData}`;

function esc(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function text(x, y, value, options = {}) {
  const { size = 16, fill = C.body, family = FONT, weight = 400, spacing = 0, anchor = "start" } = options;
  return `<text x="${x}" y="${y}" fill="${fill}" font-family="${family}" font-size="${size}px" font-weight="${weight}" letter-spacing="${spacing}px" text-anchor="${anchor}">${esc(value)}</text>`;
}

function multiline(x, y, lines, options = {}) {
  const { size = 16, fill = C.body, family = FONT, weight = 400, spacing = 0, lineHeight = 1.2 } = options;
  return `<text x="${x}" y="${y}" fill="${fill}" font-family="${family}" font-size="${size}px" font-weight="${weight}" letter-spacing="${spacing}px">${lines.map((line, index) => `<tspan x="${x}" dy="${index === 0 ? 0 : size * lineHeight}px">${esc(line)}</tspan>`).join("")}</text>`;
}

function rect(x, y, width, height, options = {}) {
  const { fill = "none", stroke = C.hairline, strokeWidth = 1 } = options;
  return `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />`;
}

function line(x1, y1, x2, y2, options = {}) {
  const { stroke = C.hairlineStrong, strokeWidth = 1 } = options;
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${strokeWidth}" />`;
}

function node(x, y, width, label, accent = C.hairlineStrong) {
  return `${rect(x, y, width, 52, { fill: C.canvasSoft, stroke: accent })}${text(x + 18, y + 32, label, { size: 13, fill: C.ink, family: MONO, weight: 400, spacing: 0.4 })}`;
}

function shellLine(x, y, command, accent = C.ink) {
  return `${text(x, y, "$", { size: 15, fill: C.muted, family: MONO })}${text(x + 24, y, command, { size: 15, fill: accent, family: MONO })}`;
}

function base({ section, titleLines, descriptionLines, drawing }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${C.canvas}" />
  <image href="${logoHref}" x="64" y="48" width="48" height="48" preserveAspectRatio="xMidYMid meet" />
  ${text(128, 78, "BLUE LIZARD", { size: 14, fill: C.ink, weight: 600, spacing: 1.8 })}
  ${text(128, 99, section, { size: 11, fill: C.muted, weight: 600, spacing: 1.4 })}
  ${multiline(64, 190, titleLines, { size: 54, fill: C.ink, weight: 400, spacing: -1.6, lineHeight: 1.04 })}
  ${multiline(64, 360, descriptionLines, { size: 19, fill: C.body, weight: 400, lineHeight: 1.45 })}
  ${drawing}
  ${line(64, 566, 1136, 566, { stroke: C.hairline })}
  ${text(64, 594, "bluelizard.sbs", { size: 12, fill: C.muted, family: MONO, spacing: 0.4 })}
  ${text(1136, 594, "BLUE LIZARD / DEVELOPER TOOLING", { size: 11, fill: C.muted, weight: 600, spacing: 1.1, anchor: "end" })}
  </svg>`;
}

const images = {
  home: base({
    section: "01 / HOME",
    titleLines: ["Backend development,", "built with structure."],
    descriptionLines: ["Structured workflows for designing, validating,", "building, and serving backend applications."],
    drawing: `${line(820, 150, 820, 480)}${line(820, 150, 1010, 150)}${line(820, 254, 1010, 254)}${line(820, 358, 1010, 358)}${line(820, 462, 1010, 462)}${node(830, 124, 250, "CLI", C.thinking)}${node(830, 228, 250, "BLUEPRINT", C.read)}${node(830, 332, 250, "VALIDATE", C.edit)}${node(830, 436, 250, "BUILD / SERVE", C.grep)}`,
  }),
  about: base({
    section: "02 / ABOUT",
    titleLines: ["Engineering", "with structure."],
    descriptionLines: ["A systematic approach to backend", "development."],
    drawing: `${line(850, 174, 850, 438)}${line(850, 200, 1015, 200)}${line(850, 306, 1015, 306)}${line(850, 412, 1015, 412)}${node(875, 174, 220, "DESIGN", C.thinking)}${node(875, 280, 220, "VALIDATE", C.read)}${node(875, 386, 220, "EXECUTE", C.grep)}${text(850, 486, "A shared model for backend work", { size: 13, fill: C.muted, family: MONO })}`,
  }),
  features: base({
    section: "03 / FEATURES",
    titleLines: ["Tools for structured", "backend development."],
    descriptionLines: ["Blueprints. Validation. Build workflows."],
    drawing: `${rect(650, 126, 486, 300, { fill: C.surface, stroke: C.hairlineStrong })}${line(812, 126, 812, 426)}${line(974, 126, 974, 426)}${line(650, 276, 1136, 276)}${text(678, 180, "BLUEPRINTS", { size: 12, fill: C.ink, family: MONO })}${text(840, 180, "CLI", { size: 12, fill: C.ink, family: MONO })}${text(1002, 180, "MCP", { size: 12, fill: C.ink, family: MONO })}${text(678, 330, "SECURITY", { size: 12, fill: C.ink, family: MONO })}${text(840, 330, "BUILD", { size: 12, fill: C.ink, family: MONO })}${text(1002, 330, "RUNTIME", { size: 12, fill: C.ink, family: MONO })}`,
  }),
  cli: base({
    section: "04 / CLI",
    titleLines: ["Blue Lizard CLI"],
    descriptionLines: ["Build and serve through a consistent", "workflow."],
    drawing: `${rect(660, 128, 476, 300, { fill: C.surface, stroke: C.hairlineStrong })}${line(660, 180, 1136, 180)}${text(686, 162, "SHELL / EVOLVING WORKFLOW", { size: 11, fill: C.muted, weight: 600, spacing: 1.1 })}${shellLine(700, 238, "lizard build", C.ink)}${shellLine(700, 286, "lizard serve", C.ink)}${line(700, 338, 1096, 338, { stroke: C.hairline })}${text(700, 380, "@bluelizard/cli", { size: 14, fill: C.body, family: MONO })}${text(700, 410, "availability requires verification", { size: 12, fill: C.muted, family: MONO })}`,
  }),
  mcp: base({
    section: "05 / MCP",
    titleLines: ["Blue Lizard MCP"],
    descriptionLines: ["Structured tooling for AI coding agents."],
    drawing: `${line(844, 170, 844, 430)}${line(844, 190, 1010, 190)}${line(844, 300, 1010, 300)}${line(844, 410, 1010, 410)}${node(870, 164, 240, "AI AGENT", C.edit)}${node(870, 274, 240, "MCP SERVER", C.read)}${node(870, 384, 240, "BLUE LIZARD CORE", C.grep)}`,
  }),
  roadmap: base({
    section: "06 / ROADMAP",
    titleLines: ["Building Blue Lizard."],
    descriptionLines: ["An evolving developer tooling platform."],
    drawing: `${rect(812, 120, 324, 44, { fill: C.surface, stroke: C.hairlineStrong })}${text(830, 148, "ACTIVE DEVELOPMENT", { size: 12, fill: C.ink, weight: 600, spacing: 1.1 })}${line(660, 370, 1120, 370, { stroke: C.ink })}${["FOUNDATION", "BLUEPRINTS", "BUILD", "SECURITY", "MCP"].map((label, index) => { const x = 660 + index * 115; return `${rect(x, 344, 92, 52, { fill: C.canvasSoft, stroke: index < 2 ? C.ink : C.hairlineStrong })}${text(x + 46, 375, label, { size: 10, fill: C.ink, family: MONO, anchor: "middle", spacing: 0.25 })}`; }).join("")}`,
  }),
  contact: base({
    section: "07 / CONTACT",
    titleLines: ["Let's talk", "engineering."],
    descriptionLines: ["Questions, feedback, and technical inquiries."],
    drawing: `${rect(650, 154, 486, 190, { fill: C.surface, stroke: C.hairlineStrong })}${text(682, 198, "PRIMARY CONTACT", { size: 11, fill: C.muted, weight: 600, spacing: 1.1 })}${text(682, 262, "contact@bluelizard.sbs", { size: 22, fill: C.ink, family: MONO })}${line(682, 294, 1104, 294, { stroke: C.hairline })}${text(682, 326, "technical questions / project feedback", { size: 12, fill: C.body, family: MONO })}`,
  }),
  privacy: base({
    section: "08 / PRIVACY",
    titleLines: ["Privacy"],
    descriptionLines: ["Information about data and privacy practices."],
    drawing: `${rect(748, 126, 388, 316, { fill: C.surface, stroke: C.hairlineStrong })}${text(780, 164, "DOCUMENT / PRIVACY", { size: 11, fill: C.muted, weight: 600, spacing: 1.1 })}${line(780, 198, 1104, 198)}${line(780, 236, 1080, 236)}${line(780, 274, 1104, 274)}${line(780, 312, 1035, 312)}${line(780, 350, 1104, 350)}${line(780, 388, 1060, 388)}${text(780, 420, "DRAFT FOR REVIEW", { size: 11, fill: C.body, family: MONO, spacing: 0.6 })}`,
  }),
  terms: base({
    section: "09 / TERMS",
    titleLines: ["Terms of Use"],
    descriptionLines: ["Information about using Blue Lizard."],
    drawing: `${text(736, 160, "DOCUMENT / TERMS", { size: 11, fill: C.muted, weight: 600, spacing: 1.1 })}${rect(736, 184, 400, 68, { fill: C.surface, stroke: C.hairlineStrong })}${rect(736, 268, 400, 68, { fill: C.surface, stroke: C.hairlineStrong })}${rect(736, 352, 400, 68, { fill: C.surface, stroke: C.hairlineStrong })}${text(760, 226, "01  INFORMATIONAL PURPOSE", { size: 11, fill: C.ink, family: MONO })}${text(760, 310, "02  NO UNSUPPORTED GUARANTEES", { size: 11, fill: C.ink, family: MONO })}${text(760, 394, "03  RESPONSIBLE USE", { size: 11, fill: C.ink, family: MONO })}`,
  }),
};

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  for (const [name, svg] of Object.entries(images)) {
    const output = path.join(OUTPUT_DIR, `${name}.png`);
    await sharp(Buffer.from(svg)).png().toColorspace("srgb").toFile(output);
    const metadata = await sharp(output).metadata();
    if (metadata.width !== WIDTH || metadata.height !== HEIGHT || metadata.format !== "png") {
      throw new Error(`Invalid OG output for ${name}: ${JSON.stringify(metadata)}`);
    }
    console.log(`${name}.png ${metadata.width}x${metadata.height}`);
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
