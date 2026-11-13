"use client";

import { useState } from "react";

type ShellToken = { value: string; className?: string };

const shellTokenPattern = /(#.*$|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|--?[a-zA-Z][\w-]*(?:=[^\s]+)?|@[a-zA-Z0-9/_-]+|\b(?:npm|npx|lizard|node|git|cd|pnpm|yarn)\b|\b(?:install|build|serve|init|dev|check|doctor|run|start|test)\b)/g;

function tokenClass(value: string) {
  if (value.startsWith("#")) return "code-token-comment";
  if (value.startsWith("\"") || value.startsWith("'")) return "code-token-string";
  if (value.startsWith("--") || (value.startsWith("-") && value.length > 1)) return "code-token-flag";
  if (value.startsWith("@")) return "code-token-package";
  if (/^(npm|npx|lizard|node|git|cd|pnpm|yarn)$/.test(value)) return "code-token-command";
  return "code-token-keyword";
}

function highlightShellLine(line: string): ShellToken[] {
  const tokens: ShellToken[] = [];
  let cursor = 0;
  for (const match of line.matchAll(shellTokenPattern)) {
    const value = match[0];
    const index = match.index ?? 0;
    if (index > cursor) tokens.push({ value: line.slice(cursor, index) });
    tokens.push({ value, className: tokenClass(value) });
    cursor = index + value.length;
  }
  if (cursor < line.length) tokens.push({ value: line.slice(cursor) });
  return tokens;
}

function HighlightedCode({ code }: { code: string }) {
  const lines = code.split("\n");
  return <>{lines.map((line, lineIndex) => <span className="code-line" key={`${line}-${lineIndex}`}>
    {line.length === 0 ? "\u00a0" : highlightShellLine(line).map((token, tokenIndex) => <span className={token.className} key={`${token.value}-${tokenIndex}`}>{token.value}</span>)}
    {lineIndex < lines.length - 1 ? "\n" : null}
  </span>)}</>;
}

export function CopyButton({ value, label = "Copy" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try { await navigator.clipboard.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1800); } catch { setCopied(false); }
  }
  return <button className="code-copy" type="button" onClick={copy} aria-label={`${label} code to clipboard`} aria-live="polite">{copied ? "Copied" : label}</button>;
}

export function CodeBlock({ code, label = "Shell", note }: { code: string; label?: string; note?: string }) {
  return <div className="code-block"><div className="code-header"><span className="code-language"><span className="terminal-prompt" aria-hidden="true">$</span>{label}</span><CopyButton value={code} /></div><pre className="code-content"><code><HighlightedCode code={code} /></code></pre>{note ? <p className="code-note">{note}</p> : null}</div>;
}
