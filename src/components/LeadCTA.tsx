type Props = {
  variant?: "broward" | "statewide";
  context?: string;
};

export default function LeadCTA({ variant = "statewide", context }: Props) {
  const isBroward = variant === "broward";
  return (
    <div className="rounded-2xl bg-deep text-sand p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
        <div className="flex-1">
          <h3 className="font-display text-2xl">
            {isBroward
              ? "Buying or selling in Broward?"
              : "Need real numbers, not estimates?"}
          </h3>
          <p className="text-sand/70 mt-2 text-sm">
            {context ??
              "Talk to a licensed Florida real estate professional. Free, no obligation."}
          </p>
        </div>
        <a
          href={
            isBroward
              ? "https://thebrowardrealtor.com"
              : "https://thebrowardrealtor.com/contact"
          }
          className="inline-flex items-center justify-center rounded-full bg-coral text-white px-6 py-3 text-sm font-medium hover:bg-coral/90"
        >
          Get a free CMA →
        </a>
      </div>
    </div>
  );
}
