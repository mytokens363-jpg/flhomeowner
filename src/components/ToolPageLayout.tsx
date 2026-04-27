import { ReactNode } from "react";
import AdSlot from "./AdSlot";

type Props = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  belowTool?: ReactNode;
};

export default function ToolPageLayout({
  title,
  subtitle,
  children,
  belowTool,
}: Props) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <header className="mb-8">
        <h1 className="font-display text-4xl md:text-5xl text-deep">{title}</h1>
        {subtitle && (
          <p className="mt-3 text-deep/70 text-lg max-w-2xl">{subtitle}</p>
        )}
      </header>

      <AdSlot slot="top" className="mb-8" />

      <section className="rounded-2xl bg-white border border-deep/10 p-6 md:p-8 shadow-sm">
        {children}
      </section>

      {belowTool && (
        <>
          <AdSlot slot="mid" className="my-10" />
          <section>{belowTool}</section>
        </>
      )}

      <AdSlot slot="bottom" className="mt-12" />
    </div>
  );
}
