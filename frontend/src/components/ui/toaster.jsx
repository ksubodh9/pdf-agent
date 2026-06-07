import { createContext, useContext, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { X, CheckCircle2, AlertCircle, Info } from "lucide-react";

const ToastContext = createContext(null);

let toastIdCounter = 0;

export function Toaster() {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Expose globally
  if (typeof window !== "undefined") {
    window.__addToast = (toast) => {
      const id = ++toastIdCounter;
      setToasts((prev) => [...prev, { ...toast, id }]);
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), toast.duration || 4000);
    };
  }

  const icons = { success: CheckCircle2, error: AlertCircle, info: Info };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => {
        const Icon = icons[t.variant] || Info;
        return (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto flex items-start gap-3 rounded-lg border p-4 shadow-lg animate-fade-in bg-white",
              t.variant === "success" && "border-green-200 bg-green-50",
              t.variant === "error" && "border-red-200 bg-red-50",
              t.variant === "info" && "border-blue-200 bg-blue-50",
            )}
          >
            <Icon className={cn("mt-0.5 h-4 w-4 shrink-0",
              t.variant === "success" && "text-green-600",
              t.variant === "error" && "text-red-600",
              t.variant === "info" && "text-blue-600",
            )} />
            <div className="flex-1 text-sm">
              {t.title && <div className="font-semibold">{t.title}</div>}
              {t.description && <div className="text-muted-foreground">{t.description}</div>}
            </div>
            <button onClick={() => dismiss(t.id)} className="shrink-0 opacity-50 hover:opacity-100">
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export function toast({ title, description, variant = "info", duration = 4000 }) {
  window.__addToast?.({ title, description, variant, duration });
}
