import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  FileType2,
  FileSpreadsheet,
  Presentation,
  Table2,
  ImageIcon,
  Code2,
  Files,
  GitCompareArrows,
  MessagesSquare,
  Lightbulb,
  Sparkles,
  Layers,
  ShieldCheck,
  ArrowRight,
  Check,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const FEATURES = [
  {
    icon: Lightbulb,
    title: "Insights",
    desc: "Automatic classification, short & detailed summaries, key topics, keywords, and named entities — so you know what a document is about before reading a word.",
  },
  {
    icon: MessagesSquare,
    title: "Chat",
    desc: "Ask questions in plain language. A retrieval-augmented pipeline answers strictly from your document, with a page-level citation behind every answer.",
  },
  {
    icon: Table2,
    title: "Tables",
    desc: "Detect and extract tabular data from your documents into clean, structured rows you can review and export.",
  },
  {
    icon: Files,
    title: "Multi-PDF",
    desc: "Ask a single question across several documents at once and get one synthesized answer, with citations to each source.",
  },
  {
    icon: GitCompareArrows,
    title: "Compare",
    desc: "Place two documents side by side and surface the differences, overlaps, and key changes between them.",
  },
  {
    icon: Sparkles,
    title: "Suggested questions",
    desc: "Not sure where to start? DocIntel proposes smart questions tailored to each document.",
  },
];

const FORMATS = [
  { icon: FileText, label: "PDF" },
  { icon: FileType2, label: "Word" },
  { icon: FileSpreadsheet, label: "Excel" },
  { icon: Presentation, label: "PowerPoint" },
  { icon: Table2, label: "CSV" },
  { icon: Code2, label: "HTML" },
  { icon: ImageIcon, label: "Images" },
];

const STEPS = [
  { n: "01", title: "Upload", desc: "Drop in a PDF, Word, Excel, PowerPoint, CSV, HTML, or image file. We validate and securely store it." },
  { n: "02", title: "Understand", desc: "We classify, summarize, index, and extract tables from the document." },
  { n: "03", title: "Ask", desc: "Chat, compare, query across documents, and cite sources instantly." },
];

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
        <FileText className="h-5 w-5 text-white" />
      </div>
      <span className="text-lg font-semibold tracking-tight text-slate-900">
        DocIntel
      </span>
    </Link>
  );
}

export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Nav */}
      <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/80 backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Logo />
          <div className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm text-slate-600 hover:text-slate-900">Features</a>
            <a href="#how" className="text-sm text-slate-600 hover:text-slate-900">How it works</a>
            <a href="#security" className="text-sm text-slate-600 hover:text-slate-900">Security</a>
          </div>
          <div className="hidden items-center gap-3 md:flex">
            <Link to="/login">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link to="/signup">
              <Button size="sm">Get started</Button>
            </Link>
          </div>
          <button
            className="text-slate-700 md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>
        {menuOpen && (
          <div className="border-t border-slate-100 px-6 py-4 md:hidden">
            <div className="flex flex-col gap-3">
              <a href="#features" className="text-sm text-slate-600" onClick={() => setMenuOpen(false)}>Features</a>
              <a href="#how" className="text-sm text-slate-600" onClick={() => setMenuOpen(false)}>How it works</a>
              <a href="#security" className="text-sm text-slate-600" onClick={() => setMenuOpen(false)}>Security</a>
              <div className="flex gap-3 pt-2">
                <Link to="/login" className="flex-1"><Button variant="outline" className="w-full">Sign in</Button></Link>
                <Link to="/signup" className="flex-1"><Button className="w-full">Get started</Button></Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-6 pt-20 pb-16 text-center">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
            AI-powered document intelligence
          </div>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
            Understand any document in&nbsp;
            <span className="text-indigo-600">seconds</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
            Upload a document to get started — PDF, Word, Excel, PowerPoint, CSV,
            HTML, or image. DocIntel classifies it, summarizes it, extracts
            tables, and lets you chat, compare, and query across documents —
            every answer backed by a page-level citation.
          </p>

          {/* Supported formats */}
          <div className="mx-auto mt-8 flex max-w-2xl flex-wrap items-center justify-center gap-2">
            {FORMATS.map((f) => (
              <span
                key={f.label}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600"
              >
                <f.icon className="h-3.5 w-3.5 text-indigo-600" />
                {f.label}
              </span>
            ))}
          </div>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/signup">
              <Button size="lg" className="gap-2">
                Start for free <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline">Sign in</Button>
            </Link>
          </div>
          <p className="mt-4 text-xs text-slate-400">No credit card required</p>

          {/* Product preview */}
          <div className="mx-auto mt-16 max-w-4xl">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-2 shadow-sm">
              <div className="rounded-xl border border-slate-200 bg-white">
                <div className="flex items-center gap-1.5 border-b border-slate-100 px-4 py-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                  <span className="ml-3 text-xs text-slate-400">DocIntel — research-paper.pdf</span>
                </div>
                <div className="grid gap-4 p-6 text-left sm:grid-cols-3">
                  <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                    <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
                      <Lightbulb className="h-3 w-3" /> Research Paper
                    </div>
                    <p className="text-xs text-slate-400">confidence 0.93</p>
                    <div className="mt-3 space-y-1.5">
                      <div className="h-2 w-full rounded bg-slate-100" />
                      <div className="h-2 w-5/6 rounded bg-slate-100" />
                      <div className="h-2 w-2/3 rounded bg-slate-100" />
                    </div>
                  </div>
                  <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                    <p className="mb-2 text-xs font-medium text-slate-500">Key topics</p>
                    <div className="flex flex-wrap gap-1.5">
                      {["Machine Learning", "Computer Vision", "Neural Nets"].map((t) => (
                        <span key={t} className="rounded-full bg-white px-2 py-0.5 text-xs text-slate-600 ring-1 ring-slate-200">{t}</span>
                      ))}
                    </div>
                    <div className="mt-4 space-y-1.5">
                      <div className="h-2 w-full rounded bg-slate-100" />
                      <div className="h-2 w-4/5 rounded bg-slate-100" />
                    </div>
                  </div>
                  <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                    <p className="mb-2 text-xs font-medium text-slate-500">Chat</p>
                    <div className="rounded-md bg-white p-2 text-xs text-slate-600 ring-1 ring-slate-200">
                      Revenue increased 12%.
                      <span className="mt-1 block text-[10px] text-indigo-600">Source · Page 14</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-slate-100 bg-slate-50/60 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Five ways to work with your documents
            </h2>
            <p className="mt-4 text-slate-600">
              Insights, Chat, Tables, Multi-PDF, and Compare — DocIntel turns
              dense files into answers you can trust.
            </p>
          </div>
          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-white p-7">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50">
                  <f.icon className="h-5 w-5 text-indigo-600" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Three steps to insight
            </h2>
            <p className="mt-4 text-slate-600">
              A retrieval-augmented pipeline keeps every answer grounded in your document.
            </p>
          </div>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="relative rounded-2xl border border-slate-200 p-7">
                <span className="text-sm font-semibold text-indigo-600">{s.n}</span>
                <h3 className="mt-3 text-lg font-semibold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security strip */}
      <section id="security" className="border-y border-slate-100 bg-slate-50/60 py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 md:grid-cols-2">
          <div>
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50">
              <ShieldCheck className="h-5 w-5 text-indigo-600" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Built with security in mind
            </h2>
            <p className="mt-4 text-slate-600">
              Files are validated on upload, inputs are sanitized, and access is
              rate-limited. Your documents stay yours.
            </p>
          </div>
          <ul className="space-y-4">
            {[
              "PDF, Word, Excel, PowerPoint, CSV, HTML & image support",
              "File type, size & corruption validation",
              "Answers grounded only in your documents",
              "Page-level citations on every response",
              "Multi-document Q&A and side-by-side compare",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-indigo-600">
                  <Check className="h-3 w-3 text-white" />
                </span>
                <span className="text-sm text-slate-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-4xl px-6">
          <div className="rounded-3xl bg-slate-900 px-8 py-16 text-center">
            <Layers className="mx-auto mb-5 h-8 w-8 text-indigo-400" />
            <h2 className="mx-auto max-w-xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Turn your next PDF into answers
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-slate-300">
              Start free and upload your first document in under a minute.
            </p>
            <div className="mt-8 flex justify-center">
              <Link to="/signup">
                <Button size="lg" className="gap-2 bg-white text-slate-900 hover:bg-slate-100">
                  Get started <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50/60">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="sm:col-span-2 lg:col-span-1">
              <Logo />
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-500">
                AI-powered document intelligence. Upload PDFs, Word, Excel,
                PowerPoint, CSV, HTML, or images and get answers in seconds.
              </p>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Features
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm text-slate-600">
                <li><a href="#features" className="hover:text-slate-900">Insights</a></li>
                <li><a href="#features" className="hover:text-slate-900">Chat</a></li>
                <li><a href="#features" className="hover:text-slate-900">Tables</a></li>
                <li><a href="#features" className="hover:text-slate-900">Multi-PDF</a></li>
                <li><a href="#features" className="hover:text-slate-900">Compare</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Product
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm text-slate-600">
                <li><a href="#how" className="hover:text-slate-900">How it works</a></li>
                <li><a href="#security" className="hover:text-slate-900">Security</a></li>
                <li><Link to="/login" className="hover:text-slate-900">Sign in</Link></li>
                <li><Link to="/signup" className="hover:text-slate-900">Get started</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Built by
              </h3>
              <p className="mt-4 text-sm font-medium text-slate-700">Subodh Kumar</p>
              <p className="mt-1 text-sm text-slate-500">
                Full-stack &amp; AI engineering
              </p>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-6 sm:flex-row">
            <p className="text-sm text-slate-400">
              © {new Date().getFullYear()} DocIntel. All rights reserved.
            </p>
            <p className="text-sm text-slate-400">
              Designed &amp; built by{" "}
              <span className="font-medium text-slate-600">Subodh Kumar</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
