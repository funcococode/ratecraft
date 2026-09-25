export interface Toast {
  id: number;
  message: string;
  tone: "default" | "error";
  action?: { label: string; onClick: () => void };
}

let toasts: Toast[] = [];
let seq = 0;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export function toast(message: string, opts: { tone?: Toast["tone"]; action?: Toast["action"]; duration?: number } = {}) {
  const t: Toast = { id: ++seq, message, tone: opts.tone ?? "default", action: opts.action };
  toasts = [...toasts.slice(-2), t];
  emit();
  window.setTimeout(() => dismissToast(t.id), opts.duration ?? (opts.action ? 6000 : 3200));
}
toast.error = (message: string) => toast(message, { tone: "error", duration: 5000 });

export function dismissToast(id: number) {
  toasts = toasts.filter((t) => t.id !== id);
  emit();
}

export const toastStore = {
  subscribe(l: () => void) {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },
  get: () => toasts,
};
