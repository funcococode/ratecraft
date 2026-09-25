import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("size-8", className)} aria-hidden>
      <rect width="32" height="32" rx="8" fill="#17150F" />
      <rect x="8" y="9.5" width="10" height="2.6" rx="1.3" fill="#F4F0E6" />
      <circle cx="23" cy="10.8" r="2.6" fill="#D9481C" />
      <rect x="8" y="15" width="16" height="2.6" rx="1.3" fill="#F4F0E6" opacity=".5" />
      <rect x="8" y="20.5" width="11" height="2.6" rx="1.3" fill="#F4F0E6" opacity=".5" />
    </svg>
  );
}

export function Logo({ to = "/", className, compact }: { to?: string; className?: string; compact?: boolean }) {
  return (
    <Link to={to} className={cn("inline-flex items-center gap-2.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring/40", className)}>
      <LogoMark />
      {!compact && <span className="font-display text-[26px] leading-none tracking-tight">RateCraft</span>}
    </Link>
  );
}
