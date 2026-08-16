from pathlib import Path
import re

path = Path("index.html")
text = path.read_text(encoding="utf-8")
original = text


def replace_once(old: str, new: str, label: str) -> None:
    global text
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected exactly 1 match, found {count}")
    text = text.replace(old, new, 1)


def regex_once(pattern: str, replacement: str, label: str) -> None:
    global text
    text, count = re.subn(pattern, replacement, text, count=1, flags=re.S)
    if count != 1:
        raise SystemExit(f"{label}: expected exactly 1 match, found {count}")


# Remove obsolete SPA copies of legal documents. Canonical versions are served
# by Cloudflare Functions at /privacy and /affiliate-disclosure.
regex_once(
    r"\n<!-- ============================================================\n     AFFILIATE DISCLOSURE\n     ============================================================ -->.*?(?=\n<!-- ============================================================\n     BOOK RECOMMENDATIONS)",
    "\n",
    "affiliate SPA section",
)
regex_once(
    r"\n<!-- ============================================================\n     PRIVACY\n     ============================================================ -->.*?(?=\n<!-- ============================================================\n     READER ACCOUNT)",
    "\n",
    "privacy SPA section",
)

# Make legal navigation ordinary links instead of SPA handlers.
replace_once(
    '''      <a href="/privacy" onclick="goPrivacy();return false">Privacy</a>\n      <a href="/affiliate-disclosure" onclick="goAffiliateDisclosure();return false">Disclosure</a>''',
    '''      <a href="/privacy">Privacy Policy</a>\n      <a href="/terms">Terms of Use</a>\n      <a href="/affiliate-disclosure">Affiliate Disclosure</a>''',
    "footer legal links",
)
replace_once(
    '<a href="/affiliate-disclosure" onclick="goAffiliateDisclosure();return false">Read the full disclosure.</a>',
    '<a href="/affiliate-disclosure">Read the full Affiliate Disclosure.</a>',
    "book disclosure link",
)

# Remove dead SPA legal-route functions and branches.
regex_once(
    r"\nfunction goPrivacy\(\)\{.*?\n\}\n\nfunction goAffiliateDisclosure\(\)\{.*?\n\}\n",
    "\n",
    "legacy legal functions",
)
replace_once(
    "  if(location.pathname === '/privacy' || location.pathname === '/privacy/') return goPrivacy();\n  if(location.pathname === '/affiliate-disclosure' || location.pathname === '/affiliate-disclosure/') return goAffiliateDisclosure();\n",
    "",
    "routeFromLocation legal branches",
)
replace_once(
    """    }else if(location.pathname === '/privacy' || location.pathname === '/privacy/'){
      goPrivacy();
    }else if(location.pathname === '/affiliate-disclosure' || location.pathname === '/affiliate-disclosure/'){
      goAffiliateDisclosure();
""",
    "",
    "init legal branches",
)

# Explain public display-name behavior at the point of collection.
replace_once(
    '<input type="text" id="readerDisplayName" maxlength="60" autocomplete="nickname" placeholder="How your name appears">',
    '<input type="text" id="readerDisplayName" maxlength="60" autocomplete="nickname" placeholder="How your name appears" aria-describedby="readerDisplayNameHelp">\n          <small class="field-help" id="readerDisplayNameHelp">This display name may appear publicly beside comments you post.</small>',
    "display-name privacy notice",
)

# Keep terms/privacy notice inside the signup-only disclosure block so it is not
# shown during ordinary sign-in. Newsletter consent remains a separate unchecked choice.
signup_old = '''        <div class="signup-consent" id="readerNewsletterSignup">
          <label class="consent-label" for="readerNewsletterOptIn">
            <input type="checkbox" id="readerNewsletterOptIn">
            <span><strong>Email me publication updates.</strong> Send me an email when Mind Over Matter publishes a new essay or book recommendation. This is optional; I can unsubscribe at any time.</span>
          </label>
        </div>'''
signup_new = '''        <div class="signup-consent" id="readerNewsletterSignup">
          <label class="consent-label" for="readerNewsletterOptIn">
            <input type="checkbox" id="readerNewsletterOptIn">
            <span><strong>Email me publication updates.</strong> Send me an email when Mind Over Matter publishes a new essay or book recommendation. This is optional; I can unsubscribe at any time.</span>
          </label>
          <p class="signup-legal-note" id="readerSignupLegalNotice">By creating a reader account, you agree to the <a href="/terms">Terms of Use</a> and acknowledge the <a href="/privacy">Privacy Policy</a>. Publication emails are optional and require the separate choice above.</p>
        </div>'''
replace_once(signup_old, signup_new, "signup legal notice")

replace_once(
    ".consent-label strong{ color:var(--ink); }",
    '''.consent-label strong{ color:var(--ink); }

  .field-help{
    display:block;
    margin-top:6px;
    color:var(--ink-faint);
    font-size:11.5px;
    line-height:1.55;
    text-transform:none;
    letter-spacing:0;
  }

  .signup-legal-note{
    margin:14px 0 0;
    color:var(--ink-faint);
    font-size:11.5px;
    line-height:1.6;
    text-align:left;
  }

  .signup-legal-note a{
    color:var(--gold-soft);
    text-decoration:underline;
    text-underline-offset:2px;
  }''',
    "signup disclosure styles",
)

# Static checks: only a publishable Supabase key may remain client-side.
for forbidden in (
    'id="view-privacy"',
    'id="view-affiliate-disclosure"',
    'goPrivacy()',
    'goAffiliateDisclosure()',
    'SUPABASE_SECRET_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'RESEND_API_KEY',
    'sb_secret_',
    'service_role',
):
    if forbidden in text:
        raise SystemExit(f"validation failed; forbidden content remains: {forbidden}")

for required in (
    '<a href="/privacy">Privacy Policy</a>',
    '<a href="/terms">Terms of Use</a>',
    '<a href="/affiliate-disclosure">Affiliate Disclosure</a>',
    'id="readerSignupLegalNotice"',
    'id="readerDisplayNameHelp"',
    "const SUPABASE_KEY = 'sb_publishable_",
    'id="readerNewsletterOptIn"',
):
    if required not in text:
        raise SystemExit(f"validation failed; required content missing: {required}")

if text == original:
    raise SystemExit("cleanup made no changes")

path.write_text(text, encoding="utf-8")
print(f"index.html cleaned: {len(original):,} -> {len(text):,} bytes")
