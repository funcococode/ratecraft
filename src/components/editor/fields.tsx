import { useId, useRef, useState, type ReactNode } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { fileToCompactDataUrl } from "@/lib/image";
import { toast } from "@/lib/toast";

export function Field({ label, hint, children, className, htmlFor }: { label: string; hint?: ReactNode; children: ReactNode; className?: string; htmlFor?: string }) {
  return (
    <div className={cn("grid gap-1.5", className)}>
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={htmlFor} className="text-[12.5px] font-medium text-ink-2">
          {label}
        </label>
        {hint && <span className="text-[11.5px] text-mute">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

export function PanelSection({ title, action, children, className }: { title: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn("border-b border-line/80 px-5 py-5 last:border-0", className)}>
      <div className="mb-4 flex items-center justify-between gap-2">
        <h3 className="eyebrow">{title}</h3>
        {action}
      </div>
      <div className="grid gap-4">{children}</div>
    </section>
  );
}

export function Segmented<T extends string | number>({
  value,
  onChange,
  options,
  className,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: ReactNode; title?: string }[];
  className?: string;
}) {
  return (
    <div role="radiogroup" className={cn("grid auto-cols-fr grid-flow-col gap-0.5 rounded-lg bg-paper-2 p-0.5", className)}>
      {options.map((o) => (
        <button
          key={String(o.value)}
          role="radio"
          aria-checked={value === o.value}
          title={o.title}
          onClick={() => onChange(o.value)}
          className={cn(
            "inline-flex h-8 items-center justify-center gap-1.5 rounded-md px-2 text-[13px] font-medium text-mute transition [&_svg]:size-4",
            value === o.value ? "bg-surface text-ink shadow-sm ring-1 ring-ink/5" : "hover:text-ink",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function ImagePicker({
  value,
  onChange,
  maxSize,
  label = "Add image",
  className,
}: {
  value?: string;
  onChange: (v: string | undefined) => void;
  maxSize?: number;
  label?: string;
  className?: string;
}) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function pick(file?: File) {
    if (!file) return;
    setBusy(true);
    try {
      onChange(await fileToCompactDataUrl(file, maxSize));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't load that image");
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <input ref={input} id={id} type="file" accept="image/*" className="hidden" onChange={(e) => pick(e.target.files?.[0])} />
      <label
        htmlFor={id}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          pick(e.dataTransfer.files?.[0]);
        }}
        className={cn(
          "relative grid size-14 shrink-0 cursor-pointer place-items-center overflow-hidden rounded-lg border border-dashed border-input bg-card text-mute transition hover:border-ink/40 hover:text-ink",
          value && "border-solid",
        )}
      >
        {busy ? <Loader2 className="size-4 animate-spin" /> : value ? <img src={value} alt="" className="size-full object-contain" /> : <ImagePlus className="size-4" />}
      </label>
      <div className="flex flex-col items-start gap-0.5 text-[12.5px]">
        <label htmlFor={id} className="cursor-pointer font-medium text-ink hover:underline">
          {value ? "Replace" : label}
        </label>
        {value ? (
          <button onClick={() => onChange(undefined)} className="inline-flex items-center gap-1 text-mute hover:text-destructive">
            <X className="size-3" /> Remove
          </button>
        ) : (
          <span className="text-mute">PNG, JPG, SVG · drop or click</span>
        )}
      </div>
    </div>
  );
}

/** Number input that allows an empty state (null) and doesn't fight the cursor. */
export function NumberInput({
  value,
  onChange,
  placeholder,
  className,
  id,
}: {
  value: number | null;
  onChange: (v: number | null) => void;
  placeholder?: string;
  className?: string;
  id?: string;
}) {
  const [text, setText] = useState(value == null ? "" : String(value));
  const [lastValue, setLastValue] = useState(value);
  if (value !== lastValue) {
    setLastValue(value);
    if (Number(text) !== value) setText(value == null ? "" : String(value));
  }
  return (
    <input
      id={id}
      inputMode="decimal"
      value={text}
      placeholder={placeholder}
      onChange={(e) => {
        const t = e.target.value.replace(/[^\d.]/g, "");
        setText(t);
        const n = t === "" ? null : Number(t);
        const next = n != null && Number.isFinite(n) ? n : null;
        setLastValue(next);
        onChange(next);
      }}
      className={cn(
        "flex h-9 w-full min-w-0 rounded-md border border-input bg-card px-3 py-1 text-sm tabular-nums shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
        className,
      )}
    />
  );
}
