import { ReactNode } from "react";

type Props = {
  title: string;
  subtitle?: string;
  updated?: string;
  children: ReactNode;
};

/**
 * Wrapper for legal/about/contact pages — long-form text with consistent typography.
 * Uses the same color palette as the tool pages.
 */
export default function ProsePage({ title, subtitle, updated, children }: Props) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <header className="mb-10 pb-6 border-b border-deep/10">
        <h1 className="font-display text-4xl md:text-5xl text-deep">{title}</h1>
        {subtitle && (
          <p className="mt-3 text-deep/70 text-lg">{subtitle}</p>
        )}
        {updated && (
          <p className="mt-4 text-xs uppercase tracking-widest text-deep/50">
            Last updated {updated}
          </p>
        )}
      </header>
      <div className="prose-content space-y-5 text-deep/85 leading-relaxed">
        {children}
      </div>
    </article>
  );
}
