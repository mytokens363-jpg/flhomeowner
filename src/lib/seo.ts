import type { Metadata } from "next";

type Args = {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
};

export function pageMetadata({
  title,
  description,
  path,
  ogImage,
}: Args): Metadata {
  const url = `https://flhomeowner.com${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      url,
      title,
      description,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export function breadcrumbJsonLd(
  items: { name: string; url: string }[]
): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `https://flhomeowner.com${it.url}`,
    })),
  });
}
