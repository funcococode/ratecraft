import { AtSign, Globe, Mail, MapPin, Phone, Copy, FileJson, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, PanelSection, Segmented } from "./fields";
import { CURRENCIES } from "@/lib/themes";
import { formatMoney } from "@/lib/format";
import type { Contact, RateCard } from "@/lib/types";
import type { Update } from "./ContentPanel";

const CONTACT_FIELDS: { key: keyof Contact; label: string; icon: typeof Mail; placeholder: string }[] = [
  { key: "email", label: "Email", icon: Mail, placeholder: "hello@yourstudio.com" },
  { key: "phone", label: "Phone / WhatsApp", icon: Phone, placeholder: "+91 98765 43210" },
  { key: "website", label: "Website", icon: Globe, placeholder: "yourstudio.com" },
  { key: "instagram", label: "Social handle", icon: AtSign, placeholder: "@yourstudio" },
  { key: "location", label: "Location", icon: MapPin, placeholder: "Mumbai, India" },
];

export function DetailsPanel({
  card,
  update,
  onDuplicate,
  onDelete,
  onExportJson,
}: {
  card: RateCard;
  update: Update;
  onDuplicate: () => void;
  onDelete: () => void;
  onExportJson: () => void;
}) {
  const cur = card.currency;
  const preset = CURRENCIES.find((c) => c.code === cur.code && c.symbol === cur.symbol)?.code ?? "custom";

  return (
    <div>
      <PanelSection title="Currency">
        <Field label="Currency">
          <Select
            value={preset}
            onValueChange={(code) => {
              const c = CURRENCIES.find((x) => x.code === code);
              if (c)
                update((d) => {
                  d.currency.code = c.code;
                  d.currency.symbol = c.symbol;
                  d.currency.locale = c.locale;
                  d.currency.decimals = c.code === "JPY" ? 0 : d.currency.decimals;
                });
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  <span className="w-9 font-mono text-xs text-mute">{c.code}</span> {c.name}
                </SelectItem>
              ))}
              {preset === "custom" && <SelectItem value="custom">Custom ({cur.symbol})</SelectItem>}
            </SelectContent>
          </Select>
        </Field>
        <div className="grid grid-cols-[5.5rem_1fr] gap-3">
          <Field label="Symbol" htmlFor="c-sym">
            <Input id="c-sym" value={cur.symbol} onChange={(e) => update((d) => void (d.currency.symbol = e.target.value), "cur-sym")} placeholder="₹" />
          </Field>
          <Field label="Position">
            <Segmented
              value={cur.position}
              onChange={(v) => update((d) => void (d.currency.position = v))}
              options={[
                { value: "before", label: `${cur.symbol.trim() || "₹"}100` },
                { value: "after", label: `100 ${cur.symbol.trim() || "₹"}` },
              ]}
            />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Decimals">
            <Segmented
              value={cur.decimals}
              onChange={(v) => update((d) => void (d.currency.decimals = v))}
              options={[
                { value: 0, label: "None" },
                { value: 2, label: ".00" },
              ]}
            />
          </Field>
          <Field label="Number style">
            <Segmented
              value={cur.locale === "en-IN" ? "en-IN" : cur.locale === "de-DE" ? "de-DE" : "en-US"}
              onChange={(v) => update((d) => void (d.currency.locale = v))}
              options={[
                { value: "en-IN", label: "1,00,000", title: "Indian grouping" },
                { value: "en-US", label: "100,000", title: "International" },
                { value: "de-DE", label: "100.000", title: "European" },
              ]}
            />
          </Field>
        </div>
        <p className="text-xs text-mute">
          Preview: <span className="font-medium text-ink tabular-nums">{formatMoney(125000, cur)}</span>
        </p>
      </PanelSection>

      <PanelSection title="Contact">
        {CONTACT_FIELDS.map(({ key, label, icon: Icon, placeholder }) => (
          <Field key={key} label={label} htmlFor={`ct-${key}`}>
            <div className="relative">
              <Icon className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-mute" />
              <Input id={`ct-${key}`} className="pl-8" value={card.contact[key]} placeholder={placeholder} onChange={(e) => update((d) => void (d.contact[key] = e.target.value), `ct-${key}`)} />
            </div>
          </Field>
        ))}
      </PanelSection>

      <PanelSection title="Footer">
        <Field label="Note" hint="terms, taxes, booking policy" htmlFor="ft-note">
          <Textarea id="ft-note" rows={3} value={card.footer.note} onChange={(e) => update((d) => void (d.footer.note = e.target.value), "ft-note")} placeholder="50% advance to confirm. Taxes extra." />
        </Field>
        <Field label="Valid until" hint="optional" htmlFor="ft-valid">
          <Input id="ft-valid" type="date" value={card.footer.validUntil} onChange={(e) => update((d) => void (d.footer.validUntil = e.target.value))} />
        </Field>
      </PanelSection>

      <PanelSection title="This card">
        <div className="grid gap-2">
          <Button variant="outline" className="justify-start" onClick={onDuplicate}>
            <Copy /> Duplicate card
          </Button>
          <Button variant="outline" className="justify-start" onClick={onExportJson}>
            <FileJson /> Download card data (.json)
          </Button>
          <Button variant="outline" className="justify-start text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={onDelete}>
            <Trash2 /> Delete card
          </Button>
        </div>
      </PanelSection>
    </div>
  );
}
