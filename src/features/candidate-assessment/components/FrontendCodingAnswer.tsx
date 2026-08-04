"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  BookOpen,
  Check,
  Download,
  Maximize2,
  Minus,
  Monitor,
  PanelLeftOpen,
  PanelRightClose,
  Plus,
  RefreshCw,
  RotateCcw,
  Smartphone,
  Sparkles,
  Tablet,
  Trash2,
  Wand2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  AssessmentQuestion,
  FrontendAsset,
  FrontendFile,
} from "@/features/candidate-assessment/types";

interface FrontendCodingAnswerProps {
  question: AssessmentQuestion;
}

type DeviceMode = "desktop" | "tablet" | "mobile";
type ConsoleEntry = { level: string; msg: string };
type A11yFinding = { severity: "error" | "warning" | "pass"; text: string };

const DEVICE_WIDTHS: Record<DeviceMode, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "375px",
};

const FILE_ICON: Record<string, string> = {
  html: "📄",
  css: "🎨",
  javascript: "⚡",
  json: "📦",
};

const LANGUAGES = ["HTML", "CSS", "JavaScript", "React", "Vue", "Angular"];

/** Turn raw SVG markup into a data URI; pass through anything else. */
function toSrc(raw: string): string {
  if (raw.trim().startsWith("<svg")) {
    return `data:image/svg+xml,${encodeURIComponent(raw)}`;
  }
  return raw;
}

/* ------------------------------------------------------------------ */
/*  Minimal markdown renderer (headings, lists, bold, inline code)     */
/* ------------------------------------------------------------------ */

function renderInline(text: string, keyBase: string) {
  // Split on **bold** and `code`
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={`${keyBase}-${i}`} className="font-semibold text-text">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={`${keyBase}-${i}`}
          className="rounded bg-[rgba(15,23,42,0.06)] px-1 py-0.5 font-mono text-[11px] text-text dark:bg-white/[0.08]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return <span key={`${keyBase}-${i}`}>{part}</span>;
  });
}

function Markdown({ source }: { source: string }) {
  const lines = source.split("\n");
  const blocks: React.ReactNode[] = [];
  let list: string[] = [];

  const flushList = (key: string) => {
    if (list.length) {
      blocks.push(
        <ul key={key} className="mt-1.5 space-y-1">
          {list.map((item, i) => (
            <li key={i} className="flex gap-1.5 text-[12.5px] leading-relaxed text-text-secondary">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted" />
              <span>{renderInline(item, `li-${key}-${i}`)}</span>
            </li>
          ))}
        </ul>,
      );
      list = [];
    }
  };

  lines.forEach((line, i) => {
    if (line.startsWith("## ")) {
      flushList(`ul-${i}`);
      blocks.push(
        <h3 key={i} className="mt-4 text-[11px] font-semibold uppercase tracking-wide text-muted first:mt-0">
          {line.slice(3)}
        </h3>,
      );
    } else if (line.startsWith("- ")) {
      list.push(line.slice(2));
    } else if (line.trim() === "") {
      flushList(`ul-${i}`);
    } else {
      flushList(`ul-${i}`);
      blocks.push(
        <p key={i} className="mt-2 text-[12.5px] leading-relaxed text-text-secondary">
          {renderInline(line, `p-${i}`)}
        </p>,
      );
    }
  });
  flushList("ul-end");

  return <div>{blocks}</div>;
}

/* ------------------------------------------------------------------ */
/*  Reference-image lightbox                                           */
/* ------------------------------------------------------------------ */

function Lightbox({ src, onClose }: { src: string; onClose: () => void }) {
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[300] flex flex-col bg-[rgba(15,23,42,0.85)] backdrop-blur-sm">
      <div className="flex shrink-0 items-center justify-between px-4 py-3">
        <span className="text-[12px] font-medium text-white/80">Reference design</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/80 hover:bg-white/10"
            aria-label="Zoom out"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-12 text-center text-[11px] tabular-nums text-white/70">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/80 hover:bg-white/10"
            aria-label="Zoom in"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setZoom(1)}
            className="ml-1 rounded-lg px-2 py-1 text-[11px] font-medium text-white/80 hover:bg-white/10"
          >
            Fit
          </button>
          <button
            type="button"
            onClick={onClose}
            className="ml-2 flex h-8 w-8 items-center justify-center rounded-lg text-white/80 hover:bg-white/10"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto p-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt="Reference design"
          style={{ transform: `scale(${zoom})` }}
          className="max-h-full max-w-full origin-center rounded-xl bg-white shadow-2xl transition-transform"
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Asset row                                                          */
/* ------------------------------------------------------------------ */

function AssetRow({ asset }: { asset: FrontendAsset }) {
  const src = toSrc(asset.src);
  return (
    <div className="flex items-center gap-2.5 rounded-lg border border-[rgba(15,23,42,0.06)] bg-white p-2 dark:border-white/[0.06] dark:bg-white/[0.02]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className="h-9 w-9 shrink-0 rounded-md border border-[rgba(15,23,42,0.06)] bg-[rgba(15,23,42,0.02)] object-contain dark:border-white/[0.06]"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[12px] font-medium text-text">{asset.name}</p>
        <p className="text-[10px] uppercase tracking-wide text-muted">{asset.kind}</p>
      </div>
      <a
        href={src}
        download={asset.name}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted transition-colors hover:bg-[rgba(15,23,42,0.05)] hover:text-text dark:hover:bg-white/[0.06]"
        aria-label={`Download ${asset.name}`}
      >
        <Download className="h-3.5 w-3.5" />
      </a>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main                                                               */
/* ------------------------------------------------------------------ */

export function FrontendCodingAnswer({ question }: FrontendCodingAnswerProps) {
  const initialFiles = useMemo<FrontendFile[]>(
    () => question.files ?? [],
    [question.files],
  );

  const [files, setFiles] = useState<FrontendFile[]>(initialFiles);
  const [activeFile, setActiveFile] = useState(initialFiles[0]?.name ?? "");
  const [language, setLanguage] = useState("HTML");
  const [saveState, setSaveState] = useState<"saved" | "saving">("saved");
  const [device, setDevice] = useState<DeviceMode>("desktop");
  const [zoom, setZoom] = useState(1);
  const [previewTab, setPreviewTab] = useState<"preview" | "console" | "network" | "a11y">("preview");
  const [consoleEntries, setConsoleEntries] = useState<ConsoleEntry[]>([]);
  const [a11y, setA11y] = useState<A11yFinding[]>([]);
  const [lightbox, setLightbox] = useState(false);
  const [srcDoc, setSrcDoc] = useState("");
  const [previewCollapsed, setPreviewCollapsed] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const saveTimer = useRef<number | null>(null);

  const current = files.find((f) => f.name === activeFile) ?? files[0];
  const referenceSrc = question.referenceImage ? toSrc(question.referenceImage) : null;

  /* ── Build the live-preview document from the files ── */
  function buildSrcDoc(): string {
    const html = files.find((f) => f.language === "html")?.content ?? "";
    const css = files.filter((f) => f.language === "css").map((f) => f.content).join("\n");
    const js = files.filter((f) => f.language === "javascript").map((f) => f.content).join("\n");

    // Strip local file references that won't resolve inside srcdoc.
    let doc = html
      .replace(/<link[^>]*href=["']styles\.css["'][^>]*>/gi, "")
      .replace(/<script[^>]*src=["']script\.js["'][^>]*><\/script>/gi, "");

    const consoleHook = `<script>(function(){
      var send=function(level,args){try{parent.postMessage({__feConsole:true,level:level,msg:Array.prototype.map.call(args,function(a){try{return typeof a==='object'?JSON.stringify(a):String(a);}catch(e){return String(a);}}).join(' ')},'*');}catch(e){}};
      ['log','info','warn','error'].forEach(function(l){var o=console[l];console[l]=function(){send(l,arguments);o.apply(console,arguments);};});
      window.addEventListener('error',function(e){send('error',[e.message]);});
    })();</script>`;

    const styleTag = css ? `<style>${css}</style>` : "";
    const scriptTag = js ? `<script>${js}</script>` : "";

    if (doc.includes("</head>")) {
      doc = doc.replace("</head>", `${consoleHook}${styleTag}</head>`);
    } else {
      doc = `${consoleHook}${styleTag}${doc}`;
    }
    if (doc.includes("</body>")) {
      doc = doc.replace("</body>", `${scriptTag}</body>`);
    } else {
      doc = `${doc}${scriptTag}`;
    }
    return doc;
  }

  /* ── Debounced rebuild of the preview on edits ── */
  useEffect(() => {
    const t = window.setTimeout(() => {
      setConsoleEntries([]);
      setSrcDoc(buildSrcDoc());
    }, 400);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  /* ── Capture console messages from the iframe ── */
  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.data && e.data.__feConsole) {
        setConsoleEntries((prev) => [...prev, { level: e.data.level, msg: e.data.msg }]);
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  /* ── Accessibility checks against the rendered document ── */
  function runA11y() {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;
    const findings: A11yFinding[] = [];

    const imgs = Array.from(doc.querySelectorAll("img"));
    const noAlt = imgs.filter((img) => !img.hasAttribute("alt"));
    findings.push(
      noAlt.length
        ? { severity: "error", text: `${noAlt.length} image(s) missing alt text` }
        : { severity: "pass", text: "All images have alt text" },
    );

    const html = doc.documentElement;
    findings.push(
      html.getAttribute("lang")
        ? { severity: "pass", text: "Document has a lang attribute" }
        : { severity: "warning", text: "<html> is missing a lang attribute" },
    );

    const headings = Array.from(doc.querySelectorAll("h1,h2,h3,h4,h5,h6"));
    const h1s = headings.filter((h) => h.tagName === "H1");
    findings.push(
      h1s.length === 1
        ? { severity: "pass", text: "Exactly one <h1> present" }
        : { severity: "warning", text: `Found ${h1s.length} <h1> heading(s)` },
    );

    const buttons = Array.from(doc.querySelectorAll("button,a"));
    const empty = buttons.filter((b) => !b.textContent?.trim() && !b.getAttribute("aria-label"));
    findings.push(
      empty.length
        ? { severity: "error", text: `${empty.length} control(s) without accessible name` }
        : { severity: "pass", text: "Buttons and links have accessible names" },
    );

    const inputs = Array.from(doc.querySelectorAll("input,select,textarea"));
    const unlabeled = inputs.filter((el) => {
      const id = el.getAttribute("id");
      const hasLabel = id && doc.querySelector(`label[for="${id}"]`);
      return !hasLabel && !el.getAttribute("aria-label");
    });
    if (inputs.length) {
      findings.push(
        unlabeled.length
          ? { severity: "warning", text: `${unlabeled.length} form field(s) without a label` }
          : { severity: "pass", text: "Form fields are labelled" },
      );
    }

    setA11y(findings);
  }

  useEffect(() => {
    if (previewTab === "a11y") {
      const t = window.setTimeout(runA11y, 100);
      return () => window.clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewTab, srcDoc]);

  /* ── Editing ── */
  function updateActiveFile(content: string) {
    setFiles((prev) => prev.map((f) => (f.name === activeFile ? { ...f, content } : f)));
    setSaveState("saving");
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => setSaveState("saved"), 700);
  }

  function syncGutter() {
    if (gutterRef.current && textareaRef.current) {
      gutterRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  }

  function handleReset() {
    const original = initialFiles.find((f) => f.name === activeFile);
    if (original) updateActiveFile(original.content);
  }

  function handleFormat() {
    // Lightweight "format": normalise trailing whitespace per line.
    if (!current) return;
    updateActiveFile(current.content.replace(/[ \t]+$/gm, ""));
  }

  /* ── Editor keyboard shortcuts ── */
  function onEditorKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    const mod = e.metaKey || e.ctrlKey;
    if (mod && e.key.toLowerCase() === "s") {
      e.preventDefault();
      setSaveState("saved");
    } else if (mod && e.key === "/") {
      e.preventDefault();
      const ta = e.currentTarget;
      const { selectionStart, value } = ta;
      const lineStart = value.lastIndexOf("\n", selectionStart - 1) + 1;
      const isCss = current?.language === "css";
      const commented = isCss
        ? `/* ${value.slice(lineStart).split("\n")[0]} */`
        : `// ${value.slice(lineStart).split("\n")[0]}`;
      const firstLineEnd = value.indexOf("\n", lineStart);
      const end = firstLineEnd === -1 ? value.length : firstLineEnd;
      updateActiveFile(value.slice(0, lineStart) + commented + value.slice(end));
    }
  }

  const lineCount = Math.max((current?.content ?? "").split("\n").length, 1);

  return (
    <div className="fe-workspace h-full">
      <div
        className="fe-workspace-grid"
        style={previewCollapsed ? { gridTemplateColumns: "28fr 72fr 44px" } : undefined}
      >
        {/* ── Column 1 — Design brief ── */}
        <section className="flex min-h-[280px] flex-col overflow-hidden rounded-xl border border-[rgba(15,23,42,0.06)] bg-[#FAFAFA] dark:border-white/[0.06] dark:bg-[#0C0C0F]">
          <div className="flex-1 overflow-y-auto p-4">
            <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-text">
              {question.title}
            </h2>

            {/* Reference design — prominent */}
            {referenceSrc && (
              <div className="mt-4">
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted">
                  Reference design
                </p>
                <button
                  type="button"
                  onClick={() => setLightbox(true)}
                  className="group relative block w-full overflow-hidden rounded-xl border border-[rgba(15,23,42,0.08)] bg-white dark:border-white/[0.08]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={referenceSrc} alt="Reference design preview" className="w-full" />
                  <span className="absolute inset-0 flex items-center justify-center bg-[rgba(15,23,42,0.4)] opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="flex items-center gap-1.5 rounded-lg bg-white/90 px-2.5 py-1 text-[11px] font-medium text-text">
                      <Maximize2 className="h-3.5 w-3.5" />
                      Open fullscreen
                    </span>
                  </span>
                </button>
              </div>
            )}

            {/* Description (markdown) */}
            <div className="mt-4">
              <Markdown source={question.body} />
            </div>

            {/* Requirements checklist */}
            {question.requirements?.length ? (
              <div className="mt-4">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                  Requirements
                </p>
                <ul className="mt-2 space-y-1.5">
                  {question.requirements.map((req) => (
                    <li key={req} className="flex items-center gap-2 text-[12.5px] text-text-secondary">
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                        <Check className="h-2.5 w-2.5" strokeWidth={3} />
                      </span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {/* Assets */}
            {question.assets?.length ? (
              <div className="mt-4">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">Assets</p>
                <div className="mt-2 space-y-1.5">
                  {question.assets.map((asset) => (
                    <AssetRow key={asset.id} asset={asset} />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </section>

        {/* ── Column 2 — Code editor ── */}
        <section className="flex min-h-[420px] flex-col overflow-hidden rounded-xl bg-[#1e1e1e]">
          {/* Editor header */}
          <div className="flex shrink-0 items-center justify-between gap-2 border-b border-white/10 px-3 py-2">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="rounded border border-white/10 bg-[#2d2d2d] px-2 py-1 text-xs text-[#d4d4d4] outline-none"
            >
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-0.5">
              <span className="mr-1 flex items-center gap-1 text-[10px] text-white/50">
                <Sparkles className="h-3 w-3" />
                {saveState === "saving" ? "Saving…" : "Saved"}
              </span>
              <a
                href="https://developer.mozilla.org/en-US/docs/Web"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium text-[#d4d4d4] transition-colors hover:bg-white/10"
              >
                <BookOpen className="h-3.5 w-3.5" />
                Docs
              </a>
              <button
                type="button"
                onClick={handleFormat}
                className="flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium text-[#d4d4d4] transition-colors hover:bg-white/10"
              >
                <Wand2 className="h-3.5 w-3.5" />
                Format
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium text-[#d4d4d4] transition-colors hover:bg-white/10"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset
              </button>
            </div>
          </div>

          {/* File explorer */}
          <div className="flex shrink-0 items-center gap-0.5 overflow-x-auto border-b border-white/10 bg-[#181818] px-2 py-1.5">
            {files.map((f) => (
              <button
                key={f.name}
                type="button"
                onClick={() => setActiveFile(f.name)}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium transition-colors",
                  f.name === activeFile
                    ? "bg-white/10 text-white"
                    : "text-[#9a9a9a] hover:bg-white/[0.06] hover:text-[#d4d4d4]",
                )}
              >
                <span aria-hidden>{FILE_ICON[f.language] ?? "📄"}</span>
                {f.name}
              </button>
            ))}
          </div>

          {/* Editor body */}
          <div className="flex min-h-0 flex-1 overflow-hidden">
            <div
              ref={gutterRef}
              aria-hidden
              className="shrink-0 select-none overflow-hidden border-r border-white/[0.06] bg-[#1a1a1a] px-2.5 py-4 text-right font-mono text-[12px] leading-[1.5] text-[#5a5a5a]"
            >
              {Array.from({ length: lineCount }, (_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            <textarea
              ref={textareaRef}
              value={current?.content ?? ""}
              onChange={(e) => updateActiveFile(e.target.value)}
              onScroll={syncGutter}
              onKeyDown={onEditorKeyDown}
              className="min-h-0 flex-1 resize-none bg-[#1e1e1e] p-4 font-mono text-[12px] leading-[1.5] text-[#d4d4d4] outline-none"
              spellCheck={false}
            />
          </div>
        </section>

        {/* ── Column 3 — Live preview ── */}
        {previewCollapsed ? (
          <section className="flex min-h-[44px] flex-col items-center gap-3 overflow-hidden rounded-xl border border-[rgba(15,23,42,0.06)] bg-white py-2 dark:border-white/[0.06] dark:bg-[#0C0C0F]">
            <button
              type="button"
              onClick={() => setPreviewCollapsed(false)}
              className="flex h-8 w-8 items-center justify-center rounded-md text-muted transition-colors hover:bg-[rgba(15,23,42,0.05)] hover:text-text dark:hover:bg-white/[0.06]"
              aria-label="Expand preview"
              title="Expand preview"
            >
              <PanelLeftOpen className="h-4 w-4" />
            </button>
            <span
              className="text-[10px] font-semibold uppercase tracking-wide text-muted"
              style={{ writingMode: "vertical-rl" }}
            >
              Live preview
            </span>
          </section>
        ) : (
        <section className="flex min-h-[420px] flex-col overflow-hidden rounded-xl border border-[rgba(15,23,42,0.06)] bg-white dark:border-white/[0.06] dark:bg-[#0C0C0F]">
          {/* Browser chrome */}
          <div className="flex shrink-0 items-center justify-between gap-1 border-b border-[rgba(15,23,42,0.06)] px-2 py-1.5 dark:border-white/[0.06]">
            <div className="flex items-center gap-0.5">
              {([
                ["desktop", Monitor],
                ["tablet", Tablet],
                ["mobile", Smartphone],
              ] as const).map(([mode, Icon]) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setDevice(mode)}
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-md transition-colors",
                    device === mode
                      ? "bg-accent/10 text-accent"
                      : "text-muted hover:bg-[rgba(15,23,42,0.05)] hover:text-text dark:hover:bg-white/[0.06]",
                  )}
                  aria-label={mode}
                >
                  <Icon className="h-3.5 w-3.5" />
                </button>
              ))}
            </div>
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.1).toFixed(2)))}
                className="flex h-7 w-7 items-center justify-center rounded-md text-muted hover:bg-[rgba(15,23,42,0.05)] hover:text-text dark:hover:bg-white/[0.06]"
                aria-label="Zoom out"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-8 text-center text-[10px] tabular-nums text-muted">
                {Math.round(zoom * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(2, +(z + 0.1).toFixed(2)))}
                className="flex h-7 w-7 items-center justify-center rounded-md text-muted hover:bg-[rgba(15,23,42,0.05)] hover:text-text dark:hover:bg-white/[0.06]"
                aria-label="Zoom in"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setSrcDoc(buildSrcDoc())}
                className="flex h-7 w-7 items-center justify-center rounded-md text-muted hover:bg-[rgba(15,23,42,0.05)] hover:text-text dark:hover:bg-white/[0.06]"
                aria-label="Refresh preview"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setPreviewCollapsed(true)}
                className="flex h-7 w-7 items-center justify-center rounded-md text-muted hover:bg-[rgba(15,23,42,0.05)] hover:text-text dark:hover:bg-white/[0.06]"
                aria-label="Collapse preview"
                title="Collapse preview"
              >
                <PanelRightClose className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <Tabs
            value={previewTab}
            onValueChange={(v) => setPreviewTab(v as typeof previewTab)}
            className="flex min-h-0 flex-1 flex-col"
          >
            <TabsList size="compact" className="shrink-0 px-2">
              <TabsTrigger value="preview" size="compact">Preview</TabsTrigger>
              <TabsTrigger value="console" size="compact">
                Console
                {consoleEntries.length > 0 && (
                  <span className="ml-1 text-[10px] text-muted">({consoleEntries.length})</span>
                )}
              </TabsTrigger>
              <TabsTrigger value="network" size="compact">Network</TabsTrigger>
              <TabsTrigger value="a11y" size="compact">A11y</TabsTrigger>
            </TabsList>

            {/* Preview — force-mounted so the iframe stays alive for a11y/console checks */}
            <TabsContent
              value="preview"
              forceMount
              className="mt-0 min-h-0 flex-1 overflow-auto bg-[rgba(15,23,42,0.03)] p-2 data-[state=inactive]:hidden dark:bg-black/20"
            >
              <div
                className="mx-auto h-full overflow-hidden rounded-lg border border-[rgba(15,23,42,0.08)] bg-white shadow-sm dark:border-white/[0.08]"
                style={{ width: DEVICE_WIDTHS[device], maxWidth: "100%" }}
              >
                <iframe
                  ref={iframeRef}
                  title="Live preview"
                  srcDoc={srcDoc}
                  sandbox="allow-scripts allow-same-origin"
                  className="h-full w-full origin-top border-0"
                  style={{ transform: `scale(${zoom})`, transformOrigin: "top left" }}
                />
              </div>
            </TabsContent>

            {/* Console */}
            <TabsContent value="console" className="mt-0 flex min-h-0 flex-1 flex-col overflow-hidden">
              <div className="flex shrink-0 items-center justify-between px-3 pt-2">
                <span className="text-[10px] font-medium uppercase tracking-wide text-muted">Console</span>
                <button
                  type="button"
                  onClick={() => setConsoleEntries([])}
                  className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium text-muted transition-colors hover:bg-[rgba(15,23,42,0.04)] hover:text-text dark:hover:bg-white/[0.04]"
                >
                  <Trash2 className="h-3 w-3" />
                  Clear Console
                </button>
              </div>
              <div className="m-2 mt-2 min-h-0 flex-1 overflow-auto rounded-lg bg-[#1a1a1a] p-2 font-mono text-[11px] leading-relaxed">
                {consoleEntries.length === 0 ? (
                  <span className="text-[#5a5a5a]">Console output will appear here.</span>
                ) : (
                  consoleEntries.map((entry, i) => (
                    <div
                      key={i}
                      className={cn(
                        "border-b border-white/[0.04] py-0.5",
                        entry.level === "error"
                          ? "text-red-400"
                          : entry.level === "warn"
                            ? "text-amber-400"
                            : "text-[#d4d4d4]",
                      )}
                    >
                      <span className="mr-1.5 text-[#5a5a5a]">{entry.level}</span>
                      {entry.msg}
                    </div>
                  ))
                )}
              </div>
            </TabsContent>

            {/* Network */}
            <TabsContent value="network" className="mt-0 min-h-0 flex-1 overflow-auto p-3">
              <p className="py-6 text-center text-[11px] text-muted">
                No external network requests in this sandbox.
              </p>
            </TabsContent>

            {/* Accessibility */}
            <TabsContent value="a11y" className="mt-0 min-h-0 flex-1 overflow-auto p-3">
              <div className="space-y-1.5">
                {a11y.length === 0 ? (
                  <p className="py-6 text-center text-[11px] text-muted">Running checks…</p>
                ) : (
                  a11y.map((f, i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex items-start gap-2 rounded-lg border px-2.5 py-2 text-[11px]",
                        f.severity === "error"
                          ? "border-red-200 bg-red-50 text-red-700 dark:border-red-800/40 dark:bg-red-900/20 dark:text-red-400"
                          : f.severity === "warning"
                            ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800/40 dark:bg-amber-900/20 dark:text-amber-400"
                            : "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/40 dark:bg-emerald-900/20 dark:text-emerald-400",
                      )}
                    >
                      {f.severity === "pass" ? (
                        <Check className="mt-0.5 h-3 w-3 shrink-0" strokeWidth={3} />
                      ) : (
                        <span className="mt-0.5 h-3 w-3 shrink-0 text-center font-bold leading-none">!</span>
                      )}
                      <span>{f.text}</span>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </section>
        )}
      </div>

      {lightbox && referenceSrc && (
        <Lightbox src={referenceSrc} onClose={() => setLightbox(false)} />
      )}
    </div>
  );
}
