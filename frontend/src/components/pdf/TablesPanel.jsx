import { useState } from "react";
import { Table2, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTables } from "@/lib/api";
import ReactMarkdown from "react-markdown";

export default function TablesPanel({ document }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState({});

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getTables(document.id);
      setData(res);
    } catch (err) {
      setError(err.userMessage || "Failed to extract tables.");
    } finally {
      setLoading(false);
    }
  };

  const toggle = (i) => setExpanded((e) => ({ ...e, [i]: !e[i] }));

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
          <Table2 className="h-7 w-7 text-slate-400" />
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300">Extract all tables from this document</p>
        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        <Button onClick={load} disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? "Extracting..." : "Extract tables"}
        </Button>
      </div>
    );
  }

  if (data.table_count === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3">
        <Table2 className="h-10 w-10 text-slate-300 dark:text-slate-600" />
        <p className="text-sm text-slate-500 dark:text-slate-400">No tables found in this document.</p>
        <Button variant="outline" size="sm" onClick={() => setData(null)}>Try again</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 p-5 overflow-y-auto">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{data.table_count} table(s) found</p>
        <Button variant="outline" size="sm" onClick={() => setData(null)}>Re-extract</Button>
      </div>
      {data.tables.map((t, i) => (
        <Card key={i}>
          <CardHeader
            className="py-3 px-4 cursor-pointer hover:bg-slate-50 transition-colors dark:hover:bg-slate-800/50"
            onClick={() => toggle(i)}
          >
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-200">
                {t.caption || `Table ${i + 1}`}
                <span className="ml-2 text-xs font-normal text-slate-400 dark:text-slate-500">page {t.page}</span>
              </CardTitle>
              {expanded[i] ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
            </div>
          </CardHeader>
          {expanded[i] && (
            <CardContent className="px-4 pb-4 overflow-x-auto">
              <div className="prose prose-sm max-w-none text-xs dark:prose-invert">
                <ReactMarkdown>{t.markdown}</ReactMarkdown>
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
}
