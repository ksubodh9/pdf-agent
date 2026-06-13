import { Link } from "react-router-dom";
import { FileText, Lightbulb, MessagesSquare, GitCompareArrows } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const HIGHLIGHTS = [
  { icon: Lightbulb, text: "Insights from PDFs, Word, Excel, PowerPoint, CSV & images" },
  { icon: MessagesSquare, text: "Chat with your documents — every answer cites its source page" },
  { icon: GitCompareArrows, text: "Extract tables, query across files & compare side by side" },
];

/**
 * Split-screen shell for auth pages.
 * Left: branded feature panel (hidden on small screens).
 * Right: the form (passed as children).
 */
export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      {/* Brand panel */}
      <div className="relative hidden w-1/2 flex-col justify-between bg-slate-900 p-12 lg:flex">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-white">DocIntel</span>
        </Link>

        <div>
          <h2 className="max-w-md text-3xl font-bold leading-tight tracking-tight text-white">
            Understand any document in seconds.
          </h2>
          <p className="mt-4 max-w-md text-slate-300">
            AI-powered classification, summaries, and grounded answers — with
            page-level citations you can trust.
          </p>
          <ul className="mt-10 space-y-5">
            {HIGHLIGHTS.map((h) => (
              <li key={h.text} className="flex items-center gap-3">
                <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-white/10">
                  <h.icon className="h-4 w-4 text-indigo-300" />
                </span>
                <span className="text-sm text-slate-200">{h.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} DocIntel · Built by Subodh Kumar
        </p>
      </div>

      {/* Form panel */}
      <div className="relative flex w-full flex-col items-center justify-center bg-white px-6 py-12 dark:bg-slate-950 lg:w-1/2">
        <div className="absolute right-4 top-4">
          <ThemeToggle />
        </div>
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <Link to="/" className="mb-8 flex items-center justify-center gap-2 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-slate-900">DocIntel</span>
          </Link>
          {children}
        </div>
      </div>
    </div>
  );
}
