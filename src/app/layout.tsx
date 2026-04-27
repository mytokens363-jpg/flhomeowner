import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://flhomeowner.com"),
  title: {
    default: "FL Homeowner — Free Florida Property Tools",
    template: "%s | FL Homeowner",
  },
  description:
    "Free Florida-specific tools: flood zone lookup, property tax calculator by county, hurricane evacuation zone lookup. Built for FL homeowners and buyers.",
  openGraph: {
    type: "website",
    siteName: "FL Homeowner",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google AdSense — replace ca-pub-XXX after approval */}
        {/* <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
        /> */}
      </head>
      <body className="font-sans antialiased">
        <header className="border-b border-deep/10 bg-sand">
          <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
            <a href="/" className="font-display text-2xl text-deep tracking-tight">
              FL<span className="text-coral">.</span>Homeowner
            </a>
            <nav className="text-sm text-deep/80 flex gap-6">
              <a href="/flood-zone" className="hover:text-coral">Flood Zone</a>
              <a href="/property-tax" className="hover:text-coral">Property Tax</a>
              <a href="/evacuation-zone" className="hover:text-coral">Evac Zone</a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="mt-24 border-t border-deep/10 bg-sand">
          <div className="mx-auto max-w-6xl px-4 py-10 grid md:grid-cols-3 gap-8 text-sm">
            <div>
              <div className="font-display text-lg text-deep">
                FL<span className="text-coral">.</span>Homeowner
              </div>
              <p className="mt-2 text-deep/60 text-xs">
                Free property tools for Florida homeowners and buyers.
              </p>
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-deep/50 mb-2">
                Tools
              </div>
              <ul className="space-y-1.5 text-deep/80">
                <li><a href="/flood-zone" className="hover:text-coral">Flood Zone Lookup</a></li>
                <li><a href="/property-tax" className="hover:text-coral">Property Tax Calculator</a></li>
                <li><a href="/evacuation-zone" className="hover:text-coral">Hurricane Evac Zone</a></li>
              </ul>
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-deep/50 mb-2">
                Site
              </div>
              <ul className="space-y-1.5 text-deep/80">
                <li><a href="/about" className="hover:text-coral">About</a></li>
                <li><a href="/contact" className="hover:text-coral">Contact</a></li>
                <li><a href="/privacy" className="hover:text-coral">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-coral">Terms of Use</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-deep/10">
            <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-deep/50">
              <p>
                Estimates only. Not legal, financial, or insurance advice.
                Verify with your county property appraiser, FEMA, and licensed
                professionals before making decisions.
              </p>
              <p className="mt-2">© {new Date().getFullYear()} FL Homeowner</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
