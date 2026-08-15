# Mind Over Matter: one-time newsletter and analytics setup

The website code is complete, but email delivery needs private credentials that must never be placed in `index.html` or committed to GitHub.

## 1. Install the private Supabase tables and policies

1. Open Supabase.
2. Choose **Mind Over Matter**.
3. Open **SQL Editor** and create a new query.
4. Paste the complete contents of `supabase-newsletter-security.sql`.
5. Select **Run**.

This creates a private email-preference table, records the date and source of consent, adds one-click unsubscribe tokens, prevents public access to subscriber emails, and records each newsletter delivery so the same publication is not emailed twice.

## 2. Prepare email delivery with Resend

1. Create or open a Resend account at `resend.com`.
2. Add and verify `stephenleynard.com` under **Domains**. Resend will show the DNS records to add in Cloudflare.
3. Create a Resend API key and copy it once.
4. Decide on a sender, for example `Mind Over Matter <updates@stephenleynard.com>`.

## 3. Add Cloudflare Pages secrets and variables

Open Cloudflare **Workers & Pages**, choose the Pages project, then open **Settings** and **Variables and Secrets**. Add these to the Production environment:

| Name | Value | Type |
| --- | --- | --- |
| `SUPABASE_SECRET_KEY` | A new-format `sb_secret_...` key from Supabase **Settings → API Keys** | Encrypted secret |
| `RESEND_API_KEY` | The Resend API key | Encrypted secret |
| `NEWSLETTER_FROM` | `Mind Over Matter <updates@stephenleynard.com>` | Variable |
| `NEWSLETTER_REPLY_TO` | `hello@stephenleynard.com` | Variable |
| `NEWSLETTER_SENDER_NAME` | `Stephen Leynard` | Variable |
| `NEWSLETTER_MAILING_ADDRESS` | A valid mailing address, P.O. box, or general-delivery address you are permitted to use | Variable |
| `SITE_URL` | `https://stephenleynard.com` | Variable |

The Supabase secret and Resend keys are powerful secrets. Keep them in Cloudflare only. Never paste either key into HTML, GitHub, a screenshot, or a message. A legacy `service_role` key also works under the variable name `SUPABASE_SERVICE_ROLE_KEY`, but the newer `sb_secret_...` key is preferred.

After saving the variables, redeploy the latest GitHub commit from Cloudflare Pages.

## 4. Enable simple readership analytics

1. In Cloudflare, open **Workers & Pages** and choose the Pages project.
2. Open **Metrics**.
3. Under **Web Analytics**, select **Enable**.
4. Redeploy once if Cloudflare asks for a new deployment.

Cloudflare will add its analytics beacon automatically. The site's security policy is already prepared to allow that beacon, and the Privacy page now explains the measurement.

## 5. Test before announcing it

1. Create a new reader account using an email you control.
2. Leave the optional email box unchecked and confirm that the account is not subscribed.
3. Turn publication emails on from **Reader account**, save, refresh, and confirm the preference remains on.
4. Publish one private test essay. Confirm one email arrives and the links work.
5. Select the email's unsubscribe link and confirm the account page shows publication emails off.
6. Republish or edit the same test essay and confirm it does not send a duplicate email.
7. Delete the test content when finished.

Email consent is deliberately optional and separate from account creation. Do not change the signup checkbox to preselected or make it required.
