import { absoluteUrl } from "@/lib/seo/urls";

export const dynamic = "force-static";

const buildLlmsTxt = (): string => `# Ovation

> Ovation is an audio guest book for weddings. Guests scan a QR code to leave voice messages, photos, and written notes from any phone — no app to download. Couples keep every voice from their wedding day and can print the collection as the Gold Book, a linen-bound keepsake with transcripts, photos, and QR codes that play back each message.

Key facts:

- Guests need no app or account — scanning the QR code opens the guest book in the browser.
- Free to start; the Keepsake and Gold plans add longer storage, more features, and the printed Gold Book.
- The Gold Book is a linen-bound printed book (up to 180 pages) with message transcripts, favourite photos, and scannable QR codes that play back the original voice recordings.
- Digital plans are sold via Paddle; printed keepsakes are produced and shipped via print partners.
- The product is available in 27 languages; localized pages live under /{locale}/... (English is served at the root paths listed below).
- Data is EU-hosted and GDPR-compliant; user content is never sold and never used to train AI.

## Product

- [How it works](${absoluteUrl("/how-it-works")}): Create a book, print the QR code, and guests leave voice messages, photos, and notes from any phone.
- [Pricing](${absoluteUrl("/pricing")}): Free tier plus Keepsake and Gold plans with longer storage and the printed Gold Book.
- [The Gold Book](${absoluteUrl("/gold-book")}): The printed wedding keepsake — transcripts, photos, and QR codes that play back every voice.
- [Keepsakes store](${absoluteUrl("/keepsakes")}): Order the printed Gold Book and other keepsakes made from guest messages.
- [Sample book](${absoluteUrl("/sample")}): Listen to real voice messages and see the photos and notes guests leave.
- [For wedding planners](${absoluteUrl("/for-planners")}): Setup, print-ready QR cards, and keepsakes for planners' clients.

## Company

- [About](${absoluteUrl("/about")}): The team behind Ovation and why it exists.
- [Contact](${absoluteUrl("/contact")}): Questions about guest books, plans, or the Gold Book.

## Legal

- [Privacy notice](${absoluteUrl("/legal/privacy")}): How Ovation collects, uses, and protects data — EU-hosted, GDPR-compliant, never sold, never used to train AI.
- [Terms of service](${absoluteUrl("/legal/terms")}): Terms governing use of the audio guest book and keepsakes.
- [Refund policy](${absoluteUrl("/legal/refunds")}): Refunds for digital plans and printed keepsakes.

## Optional

- [Sustainability](${absoluteUrl("/sustainability")}): Responsible printing and efficient EU-based hosting.
- [Careers](${absoluteUrl("/careers")}): Open roles at Ovation.
- [Changelog](${absoluteUrl("/changelog")}): Latest features and improvements.
- [Cookie policy](${absoluteUrl("/legal/cookies")}): How Ovation uses cookies and the choices available.
`;

export const GET = (): Response =>
  new Response(buildLlmsTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
