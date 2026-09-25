import { useEffect, useState } from "react";
import { Check, Copy, ExternalLink, ImageOff, Share } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { hasImages, shareUrl } from "@/lib/share";
import { toast } from "@/lib/toast";
import type { RateCard } from "@/lib/types";

export function ShareDialog({ card, open, onOpenChange }: { card: RateCard; open: boolean; onOpenChange: (o: boolean) => void }) {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) return;
    let alive = true;
    setCopied(false);
    shareUrl(card).then((u) => alive && setUrl(u));
    return () => {
      alive = false;
    };
  }, [open, card]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast("Link copied");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy — select the link and copy it manually");
    }
  }

  const canNativeShare = typeof navigator !== "undefined" && "share" in navigator;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <div>
          <DialogTitle>Share a live link</DialogTitle>
          <DialogDescription className="mt-2">
            Anyone with this link sees a read-only version of your card and can download it. The card lives inside the link itself — nothing is uploaded to a server.
          </DialogDescription>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-line bg-card p-1.5 pl-3">
          <input readOnly value={url || "Generating…"} onFocus={(e) => e.target.select()} className="min-w-0 flex-1 bg-transparent font-mono text-xs text-ink-2 outline-none" />
          <Button size="sm" onClick={copy} disabled={!url}>
            {copied ? <Check /> : <Copy />} {copied ? "Copied" : "Copy"}
          </Button>
        </div>
        {hasImages(card) && (
          <div className="flex gap-2.5 rounded-xl bg-paper-2 p-3 text-xs text-ink-2">
            <ImageOff className="mt-0.5 size-4 shrink-0 text-mute" />
            <span>Images and your logo aren't included in links (they'd make it enormous). To share the full design, export a PNG or PDF instead.</span>
          </div>
        )}
        <div className="flex flex-wrap justify-end gap-2">
          {canNativeShare && (
            <Button variant="outline" disabled={!url} onClick={() => navigator.share({ title: card.info.title, url }).catch(() => {})}>
              <Share /> Share…
            </Button>
          )}
          <Button variant="outline" asChild disabled={!url}>
            <a href={url || undefined} target="_blank" rel="noreferrer">
              <ExternalLink /> Open
            </a>
          </Button>
        </div>
        <p className="text-[11px] text-mute">Links are a snapshot — if you edit the card later, share a fresh link.</p>
      </DialogContent>
    </Dialog>
  );
}
