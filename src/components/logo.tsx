export function RateCraftLogo({ className = "", withWordmark = false }: { className?: string; withWordmark?: boolean }) {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <svg width="24" height="24" viewBox="0 0 24 24" role="img" aria-label="RateCraft logo">
        {/* Tile/card */}
        <rect x="3" y="4" width="18" height="14" rx="3" fill="#4F46E5"/>
        {/* Grid lines */}
        <path d="M3 10h18 M9 4v14" stroke="white" strokeWidth="1.5" opacity=".8"/>
        {/* Rate tick */}
        <path d="M14 17h5" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/>
      </svg>
      {withWordmark && (
        <span style={{ fontWeight: 700, letterSpacing: "-0.01em" }}>RateCraft</span>
      )}
    </div>
  );
}
