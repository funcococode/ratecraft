import { useState, type RefObject } from "react";
import { ChevronDown, Clipboard, Download, FileImage, FileJson, FileText, Loader2, Smartphone, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { exportCard, type ExportKind } from "@/lib/export";
import { toast } from "@/lib/toast";
import type { RateCard } from "@/lib/types";

export function ExportMenu({
  card,
  nodeRef,
  withJson = true,
  variant = "default",
}: {
  card: RateCard;
  nodeRef: RefObject<HTMLDivElement | null>;
  withJson?: boolean;
  variant?: "default" | "outline";
}) {
  const [busy, setBusy] = useState(false);

  async function run(kind: ExportKind) {
    setBusy(true);
    try {
      toast(await exportCard(kind, nodeRef.current, card));
    } catch (e) {
      console.error(e);
      toast.error(e instanceof Error && e.message ? e.message : "Export failed — please try again");
    } finally {
      setBusy(false);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} disabled={busy} className="gap-1.5">
          {busy ? <Loader2 className="animate-spin" /> : <Download />}
          <span className="hidden sm:inline">{busy ? "Exporting…" : "Export"}</span>
          <ChevronDown className="size-3.5 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Image</DropdownMenuLabel>
        <DropdownMenuItem onSelect={() => run("png")}>
          <FileImage /> PNG <span className="ml-auto text-xs text-mute">high-res</span>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => run("square")}>
          <Square /> Square post <span className="ml-auto text-xs text-mute">1080²</span>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => run("story")}>
          <Smartphone /> Story <span className="ml-auto text-xs text-mute">1080×1920</span>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => run("copy")}>
          <Clipboard /> Copy image
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Document</DropdownMenuLabel>
        <DropdownMenuItem onSelect={() => run("pdf-a4")}>
          <FileText /> PDF <span className="ml-auto text-xs text-mute">A4, printable</span>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => run("pdf-fit")}>
          <FileText /> PDF <span className="ml-auto text-xs text-mute">single page</span>
        </DropdownMenuItem>
        {withJson && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => run("json")}>
              <FileJson /> Card data <span className="ml-auto text-xs text-mute">.json</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
