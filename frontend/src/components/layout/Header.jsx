import { FileText, Cpu } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Header({ document }) {
  if (!document) {
    return (
      <div className="flex h-14 items-center border-b bg-white px-6">
        <p className="text-sm text-muted-foreground">Select or upload a document to get started</p>
      </div>
    );
  }

  const name = document.original_filename || document.filename || "Document";
  const docType = document.document_type;

  const typeColors = {
    "Research Paper": "indigo",
    "Legal Document": "rose",
    "Medical Report": "green",
    "Invoice": "amber",
    "Financial Report": "amber",
    "Resume": "violet",
  };

  return (
    <div className="flex h-14 items-center gap-3 border-b bg-white px-6">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50">
        <FileText className="h-4 w-4 text-indigo-600" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-semibold text-slate-900">{name}</p>
          {docType && (
            <Badge variant={typeColors[docType] || "secondary"} className="hidden sm:inline-flex text-[10px]">
              {docType}
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {document.page_count ?? "?"} pages
          {document.status && (
            <span className={`ml-2 ${document.status === "ready" ? "text-green-600" : "text-amber-600"}`}>
              {document.status}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
