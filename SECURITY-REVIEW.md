# Mind Over Matter security review

Reviewed 15 August 2026. This is a code and configuration review, not a penetration test.

## Findings

- **No private database key is exposed in the website.** Browser code contains only the Supabase publishable key. The new email function reads the Supabase secret and Resend keys from encrypted Cloudflare environment secrets.
- **Posts and books use owner-only writes.** The included RLS policies allow public reading only for released essays and published books. Creating, editing, publishing, and deleting are restricted to Stephen's fixed Supabase user ID.
- **Draft essays stay private.** Public policies exclude drafts and future-scheduled essays.
- **Reader email addresses are not public profile data.** Public profiles contain an ID and display name only. Newsletter addresses are stored in a separate table with no anonymous access and an own-row policy for signed-in readers.
- **Newsletter consent is auditable.** The database records server timestamps and consent source, keeps a private random unsubscribe token, and records content deliveries to prevent duplicate sends.
- **Comments and likes are scoped.** Readers can act only as their signed-in user ID. Comment text is escaped before display, and article text is converted through an escaping formatter before being inserted into the page.
- **Server email delivery checks the administrator again.** The notification endpoint validates the Supabase access token and the fixed owner ID before it can read private subscribers or send mail.
- **Baseline browser protections are present.** The site sends content-type, framing, referrer, permissions, HSTS, opener, and Content Security Policy headers. Account and unsubscribe pages are excluded from search indexing.

## Actions completed in this package

- Added `supabase-newsletter-security.sql` with RLS and least-privilege grants.
- Added Cloudflare-only email and unsubscribe functions.
- Added explicit, unchecked consent at signup and account-level preferences.
- Added unsubscribe headers and a visible unsubscribe link to every publication email.
- Added privacy disclosures for Supabase, Resend, and Cloudflare Web Analytics.
- Added automated checks that fail if the service-role secret boundary, RLS setup, or unsubscribe flow is removed.

## Ongoing owner practices

- Turn on multi-factor authentication for the administrator account.
- Enable Supabase leaked-password protection and keep email confirmation enabled.
- Never place `SUPABASE_SECRET_KEY`, a legacy `SUPABASE_SERVICE_ROLE_KEY`, or `RESEND_API_KEY` in GitHub or HTML.
- Rotate a private key immediately if it is ever exposed.
- Review Supabase's Security Advisor after database changes.
- Keep Cloudflare, Supabase, and Resend account recovery methods current.
- Review email preferences and delivery failures periodically; never export subscriber addresses unless necessary and protected.
