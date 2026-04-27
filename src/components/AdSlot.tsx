type Props = {
  slot: "top" | "mid" | "bottom" | "sidebar";
  className?: string;
};

/**
 * AdSense slot. Renders nothing pre-approval. After approval:
 *   1. set NEXT_PUBLIC_ADSENSE_CLIENT in .env
 *   2. uncomment the script in layout.tsx
 *   3. swap the placeholder div for an <ins> tag with your slot ID
 */
export default function AdSlot({ slot, className = "" }: Props) {
  if (process.env.NEXT_PUBLIC_ADSENSE_CLIENT !== "live") {
    return (
      <div
        className={`flex items-center justify-center rounded-lg border border-dashed border-deep/20 bg-sand/50 text-xs text-deep/40 py-6 ${className}`}
      >
        ad slot — {slot}
      </div>
    );
  }

  return (
    <div className={className}>
      <ins
        className="adsbygoogle block"
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT}
        data-ad-slot={`SLOT_${slot.toUpperCase()}`}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
