import { useLayoutEffect, useRef, useState, type Ref } from "react";
import { RateCardView, type RateCardViewProps } from "./RateCardView";

/**
 * Renders a card at its natural width and scales it down to fit the container.
 * Pass `clip` to crop to a fixed aspect ratio (thumbnails).
 */
export function ScaledCard({
  clip,
  maxScale = 1,
  cardRef,
  ...props
}: RateCardViewProps & { clip?: number; maxScale?: number; cardRef?: Ref<HTMLDivElement> }) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const width = props.width ?? 880;

  useLayoutEffect(() => {
    const o = outer.current;
    const i = inner.current;
    if (!o || !i) return;
    const ro = new ResizeObserver(() => setBox({ w: o.clientWidth, h: i.offsetHeight }));
    ro.observe(o);
    ro.observe(i);
    return () => ro.disconnect();
  }, []);

  const scale = box.w ? Math.min(maxScale, box.w / width) : 0;
  const height = clip ? box.w * clip : box.h * scale;

  return (
    <div ref={outer} className="relative w-full overflow-hidden" style={{ height: height || undefined, aspectRatio: !box.w && clip ? `1 / ${clip}` : undefined }}>
      <div
        ref={inner}
        className="absolute left-1/2 top-0 origin-top"
        style={{ width, transform: `translateX(-50%) scale(${scale})`, visibility: scale ? "visible" : "hidden" }}
      >
        <RateCardView ref={cardRef} {...props} />
      </div>
    </div>
  );
}
