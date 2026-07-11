# BIG STEPPERS AI — Integration Guide

The app currently runs in **demo mode**: every screen, flow, and email is real, but auth, payments, and data are simulated in `src/app/store.tsx`. Each simulated call is marked with a `// SUPABASE:` or `// STRIPE:` comment showing the exact one-line replacement.

## Routes

| Route | Screen |
|---|---|
| `#/` | Landing page (untouched design) |
| `#/signup` `#/login` `#/verify-email` `#/forgot-password` | Auth |
| `#/subscribe` `#/payment-success` | Subscription |
| `#/dashboard` (+ create / projects / billing / settings) | Customer dashboard |
| `#/admin` | Hidden admin panel — passcode in `src/app/admin.tsx` (change it) |

## Instagram → website: two options (both included)

### Option 1 — Manual (works today, zero setup)
Open `#/admin` → **Website Reels** → paste the reel link, pick the industry, add a title. The card appears on the landing page grid instantly. Optionally add a direct mp4 URL (e.g. Supabase Storage) so it plays natively instead of linking out to Instagram.

### Option 2 — Fully automatic (Instagram Graph API)
Post a reel with a mapped hashtag (e.g. `#roofing`) and it appears under Roofing automatically.

1. Instagram → switch to **Business/Creator** account, link a Facebook Page.
2. [developers.facebook.com](https://developers.facebook.com) → create an app → add **Instagram Graph API**.
3. Generate a **long-lived access token** and note your **IG user ID**.
4. In Supabase: run `supabase/schema.sql` once, then:
   ```bash
   supabase functions deploy instagram-sync
   supabase secrets set IG_ACCESS_TOKEN=... IG_USER_ID=...
   ```
5. Enable `pg_cron` + `pg_net` extensions and run the schedule snippet at the bottom of `schema.sql` (checks every 30 min).

Hashtag routing lives in the `hashtag_map` table (editable from the admin panel UI). Duplicates are impossible (`ig_media_id` is unique). Reels without a mapped hashtag are ignored — so personal posts never leak onto the site.

**Playback note:** auto-synced cards use Instagram's thumbnail and link to the reel. For native on-site playback (matching the hero), mirror the file to Supabase Storage and fill `video_url`.

## Wiring real auth (Supabase)
`npm i @supabase/supabase-js`, create a client, then replace the marked calls in `store.tsx`:
- `signUp` → `supabase.auth.signUp(...)` — Supabase sends the **Verify Email** template
- `signIn` → `supabase.auth.signInWithPassword(...)`; magic link and Google are one-liners (`signInWithOtp`, `signInWithOAuth`)
- Landing grid → `supabase.from('videos').select().eq('published', true)`

Paste the HTML from `src/emails/templates.ts` into Supabase Auth → Email Templates (verify / reset), and send the other 11 via Resend or Postmark from webhooks.

## Wiring Stripe
1. Create Products/Prices for Starter, Growth, Pro (monthly + yearly).
2. `subscribe()` → create a Checkout Session server-side (Supabase Edge Function), redirect to `session.url`.
3. Webhook `checkout.session.completed` → set `profiles.plan`, send Welcome + Payment Confirmation + Invoice + Receipt.
4. Billing page buttons → Stripe **Customer Portal** session (handles upgrade / cancel / payment method / invoices for you).

## Security checklist for production
- Change the admin passcode → better: gate `/admin` on `profiles.role === 'admin'`
- RLS is already defined in `schema.sql` (public read on published videos, owner-only projects, admin-only writes)
- Supabase Auth gives you encrypted passwords, secure cookies, and rate limiting out of the box; enable CAPTCHA + email confirmations in Auth settings
- Switch from HashRouter to BrowserRouter when deployed (one-line change in `src/main.tsx`) for clean URLs
