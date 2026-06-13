import { useState, useRef, useEffect } from "react";
import { Send, Loader2, FileText, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { chat } from "@/lib/api";
import { toast } from "@/components/ui/toaster";
import ReactMarkdown from "react-markdown";

function Citation({ c }) {
  const score = c.relevance_score ? `${(c.relevance_score * 100).toFixed(0)}%` : null;
  return (
    <div className="flex items-start gap-2 rounded-lg border-l-2 border-indigo-400 bg-indigo-50 px-3 py-2 text-xs text-slate-700 dark:bg-indigo-950/40 dark:text-slate-300">
      <FileText className="mt-0.5 h-3 w-3 shrink-0 text-indigo-500" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="font-semibold text-indigo-700 dark:text-indigo-300">Page {c.page ?? "?"}</span>
          {score && <span className="rounded-full bg-indigo-200 text-indigo-700 px-1.5 dark:bg-indigo-900 dark:text-indigo-300">{score}</span>}
          {c.document_name && <span className="rounded-full bg-violet-100 text-violet-700 px-1.5 truncate max-w-[120px] dark:bg-violet-900/50 dark:text-violet-300">{c.document_name}</span>}
        </div>
        <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed line-clamp-3">{c.text}</p>
      </div>
    </div>
  );
}

function Message({ msg }) {
  const [showCitations, setShowCitations] = useState(false);
  const isUser = msg.role === "user";
  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div className={cn("max-w-[85%] rounded-2xl px-4 py-3 text-sm",
        isUser
          ? "bg-indigo-600 text-white rounded-tr-sm"
          : "bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
      )}>
        <div className={cn("prose prose-sm max-w-none prose-chat", !isUser && "dark:prose-invert")}>
          <ReactMarkdown>{msg.content}</ReactMarkdown>
        </div>
        {msg.citations?.length > 0 && (
          <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-600">
            <button
              onClick={() => setShowCitations((v) => !v)}
              className="flex items-center gap-1 text-[11px] text-indigo-500 font-medium hover:text-indigo-700"
            >
              {showCitations ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              {msg.citations.length} source{msg.citations.length > 1 ? "s" : ""}
            </button>
            {showCitations && (
              <div className="mt-2 flex flex-col gap-1.5">
                {msg.citations.map((c, i) => <Citation key={i} c={c} />)}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ChatPanel({ document, pendingQuestion, onPendingClear }) {
  const docId = document?.id;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  // Auto-answer pending question from InsightsPanel
  useEffect(() => {
    if (pendingQuestion) {
      sendMessage(pendingQuestion);
      onPendingClear?.();
    }
  }, [pendingQuestion]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: msg }]);
    setLoading(true);
    try {
      const res = await chat(docId, msg, true);
      setMessages((m) => [...m, {
        role: "assistant",
        content: res.answer,
        citations: res.citations,
      }]);
    } catch (err) {
      toast({ title: "Chat error", description: err.userMessage, variant: "error" });
      setMessages((m) => [...m, {
        role: "assistant",
        content: "Sorry, I couldn't generate an answer. Please try again.",
        citations: [],
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Messages — flex-1 min-h-0 lets this shrink so the input bar stays visible */}
      <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4 flex flex-col gap-3">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 mb-3 dark:bg-indigo-950">
              <FileText className="h-6 w-6 text-indigo-400" />
            </div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Ask anything about this document</p>
            <p className="text-xs text-slate-400 mt-1 dark:text-slate-500">Answers are grounded with page citations</p>
          </div>
        )}
        {messages.map((msg, i) => <Message key={i} msg={msg} />)}
        {loading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm bg-white border border-slate-200 px-4 py-3 shadow-sm dark:bg-slate-800 dark:border-slate-700">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-500" />
              <span className="text-xs text-slate-400 dark:text-slate-500">Generating answer...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t bg-white px-4 py-3 dark:bg-slate-900">
        <div className="flex items-end gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 focus-within:border-indigo-400 focus-within:ring-1 focus-within:ring-indigo-400 transition-all dark:border-slate-700 dark:bg-slate-800">
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question about this document..."
            className="flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-slate-400 max-h-32 dark:text-slate-100 dark:placeholder:text-slate-500"
            style={{ scrollbarWidth: "none" }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="shrink-0 flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
        {messages.length > 0 && (
          <button
            onClick={() => setMessages([])}
            className="mt-1.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            Clear conversation
          </button>
        )}
      </div>
    </div>
  );
}
