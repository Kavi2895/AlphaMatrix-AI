import * as React from "react"
import { X, CheckCircle, AlertTriangle, AlertCircle } from "lucide-react"
import { cn } from "../../lib/utils"

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'warning' | 'error' | 'info';
}

interface ToastProps extends ToastMessage {
  onClose: (id: string) => void;
}

export function Toast({ id, title, description, type = 'info', onClose }: ToastProps) {
  React.useEffect(() => {
    const timer = setTimeout(() => onClose(id), 5000);
    return () => clearTimeout(timer);
  }, [id, onClose]);

  const icons = {
    success: <CheckCircle className="h-5 w-5 text-emerald-400" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-400" />,
    error: <AlertCircle className="h-5 w-5 text-rose-400" />,
    info: <CheckCircle className="h-5 w-5 text-blue-400" />
  };

  const bgClasses = {
    success: "bg-emerald-950/90 border-emerald-500/20 text-emerald-100",
    warning: "bg-amber-950/90 border-amber-500/20 text-amber-100",
    error: "bg-rose-950/90 border-rose-500/20 text-rose-100",
    info: "bg-slate-900/90 border-blue-500/20 text-blue-100"
  };

  return (
    <div
      className={cn(
        "flex w-full max-w-md items-start gap-3 rounded-lg border p-4 shadow-xl backdrop-blur-md animate-scale-in transition-all duration-300",
        bgClasses[type]
      )}
    >
      <div className="shrink-0 mt-0.5">{icons[type]}</div>
      <div className="flex-1 space-y-1">
        <h4 className="text-sm font-semibold">{title}</h4>
        {description && <p className="text-xs opacity-80 leading-relaxed">{description}</p>}
      </div>
      <button
        onClick={() => onClose(id)}
        className="shrink-0 rounded-md p-1 opacity-70 hover:opacity-100 hover:bg-white/5 transition-colors cursor-pointer"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

// Global Toast state hook
export const useToasts = () => {
  const [toasts, setToasts] = React.useState<ToastMessage[]>([]);

  const addToast = React.useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = `tst_${Date.now()}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const ToastContainer = () => (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={removeToast} />
      ))}
    </div>
  );

  return { addToast, ToastContainer, toasts };
};
