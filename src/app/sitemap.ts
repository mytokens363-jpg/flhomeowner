import { MetadataRoute } from "next";
import { FL_COUNTIES } from "@/data/counties";
import floodCountyData from "@/data/flood-county-data.json";

const BASE = "https://flhomeowner.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, priority: 1.0 },
    { url: `${BASE}/flood-zone`, lastModified: now, priority: 0.9 },
    { url: `${BASE}/property-tax`, lastModified: now, priority: 0.9 },
    { url: `${BASE}/evacuation-zone`, lastModified: now, priority: 0.9 },
    { url: `${BASE}/about`, lastModified: now, priority: 0.4 },
    { url: `${BASE}/contact`, lastModified: now, priority: 0.4 },
    { url: `${BASE}/privacy`, lastModified: now, priority: 0.3 },
    { url: `${BASE}/terms`, lastModified: now, priority: 0.3 },
  ];

  const propertyTaxPages: MetadataRoute.Sitemap = FL_COUNTIES.map((c) => ({
    url: `${BASE}/property-tax/${c.slug}`,
    lastModified: now,
    priority: 0.7,
    changeFrequency: "monthly",
  }));

  const floodCountyPages: MetadataRoute.Sitemap = Object.keys(
    floodCountyData
  ).map((slug) => ({
    url: `${BASE}/flood-zone/county/${slug}`,
    lastModified: now,
    priority: 0.7,
    changeFrequency: "monthly",
  }));

  return [...staticPages, ...propertyTaxPages, ...floodCountyPages];
}
