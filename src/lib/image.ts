/** Read an image file and downscale it so it fits comfortably in localStorage. */
export async function fileToCompactDataUrl(file: File, maxSize = 640): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Please choose an image file.");
  const src = await new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(new Error("Couldn't read that file."));
    r.readAsDataURL(file);
  });
  // SVGs stay as-is (already tiny and scalable).
  if (file.type === "image/svg+xml") return src;

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error("That image couldn't be opened."));
    el.src = src;
  });
  const scale = Math.min(1, maxSize / Math.max(img.naturalWidth, img.naturalHeight));
  const w = Math.max(1, Math.round(img.naturalWidth * scale));
  const h = Math.max(1, Math.round(img.naturalHeight * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return src;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, w, h);
  // WebP keeps transparency and is small; browsers without WebP encoding fall back to PNG.
  const out = canvas.toDataURL("image/webp", 0.86);
  return out.length < src.length ? out : src;
}
