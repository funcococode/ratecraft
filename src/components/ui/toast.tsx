import { useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { dismissToast as dismiss, toastStore } from "@/lib/toast";

export function Toaster() {
  const list = useSyncExternalStore(toastStore.subscribe, toastStore.get);
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[100] flex flex-col items-center gap-2 px-4" aria-live="polite">
      <AnimatePresence initial={false}>
        {list.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            className="pointer-events-auto flex max-w-md items-center gap-3 rounded-full bg-ink py-2.5 pr-2.5 pl-4 text-sm text-paper shadow-2xl shadow-ink/30"
          >
            {t.tone === "error" ? <AlertCircle className="size-4 shrink-0 text-vermilion" /> : <CheckCircle2 className="size-4 shrink-0 text-paper/60" />}
            <span className="min-w-0">{t.message}</span>
            {t.action ? (
              <button
                onClick={() => {
                  t.action?.onClick();
                  dismiss(t.id);
                }}
                className="rounded-full bg-paper/15 px-3 py-1 text-xs font-semibold transition hover:bg-paper/25"
              >
                {t.action.label}
              </button>
            ) : (
              <span className="w-1.5" />
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
