"use client";

import { useState } from "react";

export type CodeLanguage = "shell" | "tree" | "yaml" | "env" | "typescript" | "json";

type CodeToken = { value: string; className?: string };

const shellTokenPattern = /(#.*$|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|--?[a-zA-Z][\w-]*(?:=[^\s]+)?|@[a-zA-Z0-9/_-]+|\b(?:npm|npx|lizard|node|git|cd|pnpm|yarn)\b|\b(?:install|build|serve|init|dev|check|doctor|run|start|test)\b)/g;
const configTokenPattern = /(#[^\n]*$|\/\/[^\n]*$|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\$\{[^}]+\}|\b(?:true|false|null|services|version|build|image|command|environment|depends_on|condition|healthcheck|test|interval|timeout|retries|networks|volumes|ports|name)\b|\b[A-Z][A-Z0-9_]+(?=\s*[:=])|\b[a-zA-Z][\w-]*(?=\s*:))/g;

function tokenClass(value: string) {
  if (value.startsWith("#") || value.startsWith("//")) return "code-token-comment";
  if (value.startsWith("\"") || value.startsWith("'")) return "code-token-string";
  if (value.startsWith("${")) return "code-token-variable";
  if (value.startsWith("--") || (value.startsWith("-") && value.length > 1)) return "code-token-flag";
  if (value.startsWith("@")) return "code-token-package";
  if (/^(npm|npx|lizard|node|git|cd|pnpm|yarn)$/.test(value)) return "code-token-command";
  return "code-token-keyword";
}

function highlightLine(line: string, language: CodeLanguage): CodeToken[] {
  if (language === "tree") return [{ value: line }];
  const pattern = language === "shell" ? shellTokenPattern : configTokenPattern;
  const tokens: CodeToken[] = [];
  let cursor = 0;
  for (const match of line.matchAll(pattern)) {
    const value = match[0];
    const index = match.index ?? 0;
    if (index > cursor) tokens.push({ value: line.slice(cursor, index) });
    tokens.push({ value, className: tokenClass(value) });
    cursor = index + value.length;
  }
  if (cursor < line.length) tokens.push({ value: line.slice(cursor) });
  return tokens;
}

function HighlightedCode({ code, language }: { code: string; language: CodeLanguage }) {
  const lines = code.split("\n");
  return <>{lines.map((line, lineIndex) => <span className="code-line" key={`${line}-${lineIndex}`}>
    {line.length === 0 ? "\u00a0" : highlightLine(line, language).map((token, tokenIndex) => <span className={token.className} key={`${token.value}-${tokenIndex}`}>{token.value}</span>)}
    {lineIndex < lines.length - 1 ? "\n" : null}
  </span>)}</>;
}

function languageMarker(language: CodeLanguage) {
  if (language === "shell") return "$";
  if (language === "tree") return "├";
  if (language === "yaml") return "Y";
  if (language === "env") return "•";
  if (language === "json") return "{}";
  return "TS";
}

export function CopyButton({ value, label = "Copy" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return <button className="code-copy" type="button" onClick={copy} aria-label={`${label} code to clipboard`} aria-live="polite">{copied ? "Copied" : label}</button>;
}

export function CodeBlock({ code, label = "Shell", language = "shell", note }: { code: string; label?: string; language?: CodeLanguage; note?: string }) {
  return <div className="code-block"><div className="code-header"><span className="code-language"><span className="terminal-prompt" aria-hidden="true">{languageMarker(language)}</span>{label}</span><CopyButton value={code} /></div><pre className="code-content"><code><HighlightedCode code={code} language={language} /></code></pre>{note ? <p className="code-note">{note}</p> : null}</div>;
}
