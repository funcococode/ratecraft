import { normalizeCard } from "./factory";
import type { RateCard } from "./types";

function toBase64Url(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(s: string): Uint8Array {
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4);
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function pipe(bytes: Uint8Array, stream: CompressionStream | DecompressionStream): Promise<Uint8Array> {
  const res = new Response(new Blob([bytes as BlobPart]).stream().pipeThrough(stream));
  return new Uint8Array(await res.arrayBuffer());
}

/** Images are dropped — they'd make links far too long. */
export function stripImages(card: RateCard): RateCard {
  const c = structuredClone(card);
  delete c.info.logo;
  c.sections.forEach((s) => s.items.forEach((i) => delete i.image));
  return c;
}

export function hasImages(card: RateCard) {
  return !!card.info.logo || card.sections.some((s) => s.items.some((i) => !!i.image));
}

export async function encodeShare(card: RateCard): Promise<string> {
  const json = JSON.stringify(stripImages(card));
  const bytes = new TextEncoder().encode(json);
  if (typeof CompressionStream !== "undefined") {
    return "z" + toBase64Url(await pipe(bytes, new CompressionStream("deflate-raw")));
  }
  return "j" + toBase64Url(bytes);
}

export async function decodeShare(payload: string): Promise<RateCard | null> {
  try {
    const kind = payload[0];
    let bytes = fromBase64Url(payload.slice(1));
    if (kind === "z") bytes = await pipe(bytes, new DecompressionStream("deflate-raw"));
    else if (kind !== "j") return null;
    return normalizeCard(JSON.parse(new TextDecoder().decode(bytes)));
  } catch {
    return null;
  }
}

export async function shareUrl(card: RateCard) {
  return `${window.location.origin}/view#${await encodeShare(card)}`;
}
