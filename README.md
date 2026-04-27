# FL Homeowner — Legal/About/Contact Pages

Drop-in addition to your existing `flhomeowner` skeleton. Adds:

- `/privacy` — AdSense-compliant privacy policy
- `/terms` — Terms of Use with liability disclaimers
- `/about` — Site introduction (signals legitimacy to AdSense reviewers)
- `/contact` — Contact info pointing to `contact@flhomeowner.com`
- Updated `layout.tsx` — proper 3-column footer linking everything
- Updated `sitemap.ts` — includes the 4 new pages
- New `ProsePage.tsx` component — shared wrapper for long-form content

## Install

From your existing `flhomeowner` project root:

```bash
# Extract this tarball over your existing project
tar -xzf flhomeowner-legal.tar.gz --strip-components=0

# Sanity check the new files exist
ls src/app/privacy src/app/terms src/app/about src/app/contact
ls src/components/ProsePage.tsx

# Run dev to confirm
npm run dev
# Visit /privacy /terms /about /contact
```

## Customize before deploying

Open these and adjust to your specifics:

- `src/app/privacy/page.tsx` — confirm the contact email matches yours
- `src/app/terms/page.tsx` — Broward County is set as the venue (correct for you)
- `src/app/about/page.tsx` — tweak the "Who's behind it" paragraph if you want
  it more or less identifying. The current copy says "Broward County real
  estate professional and technology builder" without naming you.
- `src/app/contact/page.tsx` — confirm `contact@flhomeowner.com` is what you
  want; set up email forwarding in Cloudflare so messages reach your real inbox.

## Deploy

```bash
git add .
git commit -m "Add privacy, terms, about, contact pages + footer"
git push
```

Cloudflare Pages auto-rebuilds. Resubmit sitemap in Google Search Console after
deploy so the 4 new pages get crawled.

## AdSense readiness

After this commit, you've got the four pages AdSense reviewers expect:

- ✅ Privacy Policy (AdSense disclosure included)
- ✅ Terms of Use
- ✅ About page
- ✅ Contact page with real email
- ✅ Linked from every page footer

This plus the 67 county pages and 3 working tools should clear the AdSense
content bar. Wait until you have ~30 days of consistent traffic before
applying — AdSense rejects sites that look freshly launched even if all the
boxes are checked.
