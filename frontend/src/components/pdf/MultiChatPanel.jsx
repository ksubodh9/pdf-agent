import { useState, useRef, useEffect } from "react";
import { Send, Loader2, BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import { multiChat } from "@/lib/api";
import { toast } from "@/components/ui/toaster";
import ReactMarkdown from "react-markdown";

function Citation({ c }) {
  return (
    <div className="flex gap-2 rounded-lg border-l-2 border-violet-400 bg-violet-50 px-3 py-2 text-xs">
      <div className="flex-1">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="font-semibold text-violet-700">Page {c.page ?? "?"}</span>
          {c.relevance_score > 0 && (
            <span className="rounded-full bg-violet-200 text-violet-700 px-1.5">{(c.relevance_score * 100).toFixed(0)}%</span>
          )}
          {c.document_name && (
            <span className="rounded-full bg-indigo-100 text-indigo-700 px-1.5 truncate max-w-[120px]">{c.document_name}</span>
          )}
        </div>
        <p className="text-slate-600 text-[11px] line-clamp-2">{c.text}</p>
      </div>
    </div>
  );
}

function Message({ msg }) {
  const [show, setShow] = useState(false);
  const isUser = msg.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
        isUser ? "bg-violet-600 text-white rounded-tr-sm" : "bg-white border text-slate-800 rounded-tl-sm shadow-sm"
      }`}>
        <ReactMarkdown>{msg.content}</ReactMarkdown>
        {msg.citations?.length > 0 && (
          <div className="mt-2 pt-2 border-t border-slate-200">
            <button onClick={() => setShow(v => !v)} className="flex items-center gap-1 text-[11px] text-violet-500 font-medium">
              {show ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              {msg.citations.length} source{msg.citations.length > 1 ? "s" : ""}
            </button>
            {show && <div className="mt-2 flex flex-col gap-1.5">{msg.citations.map((c, i) => <Citation key={i} c={c} />)}</div>}
          </div>
        )}
      </div>
    </div>
  );
}

export default function MultiChatPanel({ documents = [] }) {
  const [selected, setSelected] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const toggleDoc = (id) =>
    setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);

  const sendMessage = async () => {
    const msg = input.trim();
    if (!msg || loading || selected.length === 0) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: msg }]);
    setLoading(true);
    try {
      const res = await multiChat(selected, msg);
      setMessages((m) => [...m, { role: "assistant", content: res.answer, citations: res.citations }]);
    } catch (err) {
      toast({ title: "Chat error", description: err.userMessage, variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (documents.length < 1) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3">
        <BookOpen className="h-10 w-10 text-slate-300" />
        <p className="text-sm text-slate-500">Upload at least two documents to use multi-PDF chat.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Document selector */}
      <div className="border-b px-5 py-3 flex flex-wrap gap-2">
        {documents.map((doc) => {
          const name = doc.original_filename || doc.filename || "Untitled";
          const active = selected.includes(doc.id);
          return (
            <button
              key={doc.id}
              onClick={() => toggleDoc(doc.id)}
              className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
                active ? "bg-violet-600 text-white border-violet-600" : "bg-white text-slate-600 border-slate-300 hover:border-violet-400"
              }`}
            >
              {name.length > 24 ? name.slice(0, 22) + "…" : name}
            </button>
          );
        })}
        {selected.length === 0 && (
          <span className="text-xs text-slate-400 self-center">Select documents above to query across them</span>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
        {messages.length === 0 && selected.length > 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <BookOpen className="h-10 w-10 text-violet-300 mb-3" />
            <p className="text-sm font-medium text-slate-600">Querying {selected.length} document(s)</p>
            <p className="text-xs text-slate-400 mt-1">Ask questions across all selected documents</p>
          </div>
        )}
        {messages.map((msg, i) => <Message key={i} msg={msg} />)}
        {loading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 rounded-2xl bg-white border px-4 py-3 shadow-sm">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-violet-500" />
              <span className="text-xs text-slate-400">Searching {selected.length} docs...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t bg-white px-4 py-3">
        <div className="flex items-end gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 focus-within:border-violet-400 focus-within:ring-1 focus-within:ring-violet-400 transition-all">
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder={selected.length ? "Ask across selected documents..." : "Select documents first..."}
            disabled={selected.length === 0}
            className="flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-slate-400 max-h-32"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading || selected.length === 0}
            className="shrink-0 flex h-7 w-7 items-center justify-center rounded-lg bg-violet-600 text-white hover:bg-violet-500 disabled:opacity-40 transition-colors"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
