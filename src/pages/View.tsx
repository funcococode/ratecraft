import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BookmarkPlus, Sparkles } from "lucide-react";
import { Logo } from "@/components/Brand";
import { ScaledCard } from "@/components/card/ScaledCard";
import { ExportMenu } from "@/components/editor/ExportMenu";
import { Button } from "@/components/ui/button";
import { decodeShare } from "@/lib/share";
import { cloneWithNewIds } from "@/lib/factory";
import { store } from "@/lib/store";
import { toast } from "@/lib/toast";
import type { RateCard } from "@/lib/types";

export default function ViewPage() {
  const { hash } = useLocation();
  const navigate = useNavigate();
  const [card, setCard] = useState<RateCard | null | undefined>(undefined);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let alive = true;
    const payload = hash.replace(/^#/, "");
    if (!payload) {
      setCard(null);
      return;
    }
    decodeShare(payload).then((c) => alive && setCard(c));
    return () => {
      alive = false;
    };
  }, [hash]);

  useEffect(() => {
    if (card) document.title = `${card.info.title} · Rate card`;
  }, [card]);

  if (card === undefined) {
    return (
      <div className="grid min-h-screen place-items-center">
        <div className="size-6 animate-spin rounded-full border-2 border-line border-t-ink" />
      </div>
    );
  }

  if (!card) {
    return (
      <div className="grid min-h-screen place-items-center px-6 text-center">
        <div>
          <div className="eyebrow">Link problem</div>
          <h1 className="font-display mt-2 text-5xl">This link looks broken</h1>
          <p className="mx-auto mt-3 max-w-sm text-mute">It may have been cut off when it was copied. Ask the sender for the full link.</p>
          <Button className="mt-6" asChild>
            <Link to="/">Go to RateCraft</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper-2/60">
      <header className="sticky top-0 z-20 border-b border-line/70 bg-paper/85 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-2 px-4">
          <Logo compact />
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                const id = store.add(cloneWithNewIds(card));
                toast("Saved a copy to your cards");
                navigate(`/app/${id}`);
              }}
            >
              <BookmarkPlus /> <span className="hidden sm:inline">Save a copy</span>
            </Button>
            <ExportMenu card={card} nodeRef={cardRef} withJson={false} variant="outline" />
          </div>
        </div>
      </header>
      <main className="paper-grain mx-auto max-w-5xl px-3 py-8 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-[880px] overflow-hidden rounded-[14px] shadow-[0_30px_80px_-30px_rgba(23,21,15,0.35),0_0_0_1px_rgba(23,21,15,0.06)]">
          <ScaledCard card={card} cardRef={cardRef} />
        </div>
        <div className="mt-10 flex flex-col items-center gap-3 text-center">
          <p className="text-sm text-mute">Made with RateCraft — free, no sign-up.</p>
          <Button asChild>
            <Link to="/app">
              <Sparkles /> Make your own rate card
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
