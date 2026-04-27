import { Metadata } from "next";
import ProsePage from "@/components/ProsePage";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Get in touch with FL Homeowner. Tool feedback, data corrections, partnership inquiries, real estate referrals.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <ProsePage
      title="Contact"
      subtitle="Real email, real human, real responses."
    >
      <h2 className="font-display text-2xl text-deep mt-8">Email us</h2>
      <p>
        The fastest way to reach us is email. We read everything and respond
        to legitimate inquiries within 1–3 business days.
      </p>
      <p className="text-2xl font-display">
        <a
          href="mailto:contact@flhomeowner.com"
          className="text-coral underline"
        >
          contact@flhomeowner.com
        </a>
      </p>

      <h2 className="font-display text-2xl text-deep mt-8">
        What to email about
      </h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>
          <strong>Tool bugs or wrong data</strong> — include the URL and what
          you expected vs. what you saw. Screenshots help.
        </li>
        <li>
          <strong>Tool requests</strong> — what Florida-specific question
          should we build a tool for?
        </li>
        <li>
          <strong>Data source suggestions</strong> — know of a public county or
          state GIS endpoint we should integrate? Send it.
        </li>
        <li>
          <strong>Partnerships</strong> — Florida licensed agents, insurance
          professionals, and contractors interested in referral partnerships.
        </li>
        <li>
          <strong>Press and media</strong> — happy to comment on Florida
          property, flood zone, and hurricane preparedness questions.
        </li>
        <li>
          <strong>Real estate help in Broward County</strong> — we can refer
          you to a licensed Broward County agent.
        </li>
      </ul>

      <h2 className="font-display text-2xl text-deep mt-8">What we can&apos;t do</h2>
      <p>
        We can&apos;t give legal, tax, insurance, or financial advice. We
        can&apos;t override official county or FEMA data. We can&apos;t look up
        the &quot;real&quot; tax bill for a specific property — that&apos;s
        what your county property appraiser is for. We can&apos;t process
        evacuation orders or emergency assistance — call your county emergency
        management or 911 for that.
      </p>

      <h2 className="font-display text-2xl text-deep mt-8">Mailing address</h2>
      <p>
        FL Homeowner
        <br />
        Broward County, Florida
      </p>
      <p className="text-sm text-deep/60">
        For mail, please email first to coordinate — we don&apos;t publish a
        physical address publicly to avoid spam.
      </p>
    </ProsePage>
  );
}
