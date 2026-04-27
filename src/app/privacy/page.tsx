import { Metadata } from "next";
import ProsePage from "@/components/ProsePage";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "How FL Homeowner collects, uses, and protects your information. Cookie policy, third-party services, your rights.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <ProsePage
      title="Privacy Policy"
      subtitle="What we collect, what we don't, and how we use it."
      updated="April 26, 2026"
    >
      <h2 className="font-display text-2xl text-deep mt-8">Overview</h2>
      <p>
        FL Homeowner (&quot;we&quot;, &quot;us&quot;, this site) operates
        flhomeowner.com to provide free Florida-specific property tools. We
        respect your privacy and collect the minimum data needed to run the site
        and improve it. This policy explains what we collect, why, and what
        choices you have.
      </p>

      <h2 className="font-display text-2xl text-deep mt-8">
        Information you give us
      </h2>
      <p>
        When you use our tools, you may enter information such as a property
        address, county selection, or estimated home value. We use this data
        only to return the result of the tool to you. <strong>We do not store
        addresses you enter into the lookup tools</strong> on our servers beyond
        what is required to fulfill the request and short-term caching for
        performance.
      </p>
      <p>
        If you contact us via the contact form or email, we keep your message
        and email address only as long as needed to respond and to maintain a
        record of the inquiry.
      </p>

      <h2 className="font-display text-2xl text-deep mt-8">
        Information collected automatically
      </h2>
      <p>
        Like most websites, we automatically collect basic technical information
        when you visit: IP address (anonymized when possible), browser type,
        device type, referring URL, pages visited, and time on site. This is
        used for analytics and to detect abuse.
      </p>

      <h2 className="font-display text-2xl text-deep mt-8">
        Cookies and similar technologies
      </h2>
      <p>
        We use cookies and similar technologies for the following purposes:
      </p>
      <ul className="list-disc pl-6 space-y-1">
        <li>
          <strong>Essential:</strong> remembering your county selection and
          recent lookups during a session.
        </li>
        <li>
          <strong>Analytics:</strong> Cloudflare Web Analytics and/or Google
          Analytics to understand aggregate traffic patterns. Analytics data is
          aggregated and not used to identify individual visitors.
        </li>
        <li>
          <strong>Advertising:</strong> Google AdSense and its partners may set
          cookies to serve and measure ads. See the AdSense section below.
        </li>
      </ul>
      <p>
        Most browsers allow you to refuse or delete cookies. If you do, some
        features may not work as expected.
      </p>

      <h2 className="font-display text-2xl text-deep mt-8">
        Google AdSense and third-party advertising
      </h2>
      <p>
        We use Google AdSense to display advertisements. Google and its partners
        may use cookies and device identifiers to serve ads based on your prior
        visits to this and other sites. This includes the use of the DoubleClick
        DART cookie and similar technologies.
      </p>
      <p>
        You can opt out of personalized advertising by visiting{" "}
        <a
          href="https://www.google.com/settings/ads"
          target="_blank"
          rel="noopener noreferrer"
          className="text-coral underline"
        >
          Google&apos;s Ads Settings
        </a>
        , or visit{" "}
        <a
          href="https://www.aboutads.info/choices/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-coral underline"
        >
          aboutads.info
        </a>{" "}
        to opt out of third-party vendor use of cookies for personalized
        advertising.
      </p>
      <p>
        Third-party vendors&apos; use of advertising cookies enables them and
        their partners to serve ads to you based on your visit to our site
        and/or other sites on the internet.
      </p>

      <h2 className="font-display text-2xl text-deep mt-8">
        Third-party services we use
      </h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>
          <strong>FEMA National Flood Hazard Layer</strong> — flood zone lookups
          send a coordinate (not an address) to FEMA&apos;s public API.
        </li>
        <li>
          <strong>OpenStreetMap Nominatim</strong> — address geocoding sends the
          address you typed to OpenStreetMap&apos;s public API.
        </li>
        <li>
          <strong>Florida county GIS services</strong> — evacuation zone
          lookups send a coordinate to the relevant county&apos;s public GIS
          endpoint.
        </li>
        <li>
          <strong>Cloudflare</strong> — hosting, CDN, DDoS protection, and
          analytics. Cloudflare&apos;s privacy policy applies to data passing
          through their network.
        </li>
        <li>
          <strong>Google AdSense and Analytics</strong> — advertising and
          aggregate analytics.
        </li>
      </ul>

      <h2 className="font-display text-2xl text-deep mt-8">
        Lead forms and real estate referrals
      </h2>
      <p>
        Some pages include a call-to-action linking to a third-party real estate
        site (such as thebrowardrealtor.com). If you click through and submit
        information on that site, you are subject to that site&apos;s privacy
        policy, not this one. We may receive a referral acknowledgment when you
        do so.
      </p>

      <h2 className="font-display text-2xl text-deep mt-8">
        Children&apos;s privacy
      </h2>
      <p>
        This site is not directed to children under 13. We do not knowingly
        collect information from children under 13. If you believe a child has
        provided us with personal information, please contact us and we will
        delete it.
      </p>

      <h2 className="font-display text-2xl text-deep mt-8">Your rights</h2>
      <p>
        Depending on your location, you may have the right to access, correct,
        or delete personal information we hold about you, and to object to
        certain processing. Florida residents under the Florida Digital Bill of
        Rights, California residents under CCPA/CPRA, and EU/UK residents under
        GDPR have specific rights. To exercise any of these rights, contact us
        using the email below.
      </p>

      <h2 className="font-display text-2xl text-deep mt-8">Data retention</h2>
      <p>
        We retain analytics data in aggregate form. Contact form messages are
        retained as long as needed to handle the inquiry and for reasonable
        record-keeping. We do not sell personal information.
      </p>

      <h2 className="font-display text-2xl text-deep mt-8">Changes</h2>
      <p>
        We may update this policy. Material changes will be reflected by an
        updated date at the top of this page. Continued use of the site after
        changes means you accept the revised policy.
      </p>

      <h2 className="font-display text-2xl text-deep mt-8">Contact</h2>
      <p>
        Questions about this policy? Email{" "}
        <a href="mailto:contact@flhomeowner.com" className="text-coral underline">
          contact@flhomeowner.com
        </a>
        .
      </p>
    </ProsePage>
  );
}
