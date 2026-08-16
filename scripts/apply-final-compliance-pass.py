from pathlib import Path

FILES = {
    'index': Path('index.html'),
    'privacy': Path('functions/privacy.js'),
    'terms': Path('functions/terms.js'),
    'affiliate': Path('functions/affiliate-disclosure.js'),
    'notify': Path('functions/api/notify.js'),
}

texts = {name: path.read_text(encoding='utf-8') for name, path in FILES.items()}

def once(text, old, new, label):
    count = text.count(old)
    if count != 1:
        raise SystemExit(f'{label}: expected exactly 1 occurrence, found {count}')
    return text.replace(old, new, 1)

s = texts['index']

# Newsletter consent disclosure and fail-closed initial state.
old = '''          <label class="consent-label" for="readerNewsletterOptIn">
            <input type="checkbox" id="readerNewsletterOptIn">
            <span><strong>Email me publication updates</strong>Receive one email when a new Mind Over Matter essay or book recommendation is published. Optional — unsubscribe anytime.</span>
          </label>
          <p class="signup-legal-note" id="readerSignupLegalNotice">By creating a reader account, you agree to the <a href="/terms">Terms of Use</a> and acknowledge the <a href="/privacy">Privacy Policy</a>. Email updates stay off unless you select the option above.</p>'''
new = '''          <label class="consent-label" for="readerNewsletterOptIn">
            <input type="checkbox" id="readerNewsletterOptIn" disabled>
            <span><strong>Email me publication updates</strong>Receive one email when a new Mind Over Matter essay or book recommendation is published. Optional — unsubscribe anytime.</span>
          </label>
          <p class="newsletter-compliance-note" id="newsletterComplianceNote">Checking publication-email availability…</p>
          <p class="signup-legal-note" id="readerSignupLegalNotice">By creating a reader account, you agree to the <a href="/terms">Terms of Use</a> and acknowledge the <a href="/privacy">Privacy Policy</a>. Email updates stay off unless you select the separate option above.</p>'''
s = once(s, old, new, 'signup consent block')

# Add a compact style for sender/availability disclosure.
css_anchor = '''  .signup-legal-note{
    margin:17px 0 0;
    padding-top:15px;
    border-top:1px solid var(--rule);
    font-size:12px;
    line-height:1.72;
  }
'''
css_new = css_anchor + '''
  .newsletter-compliance-note{
    margin:14px 0 0;
    padding:12px 13px;
    border:1px solid var(--rule);
    border-radius:10px;
    background:var(--bg);
    color:var(--ink-faint);
    font-size:11.75px;
    line-height:1.65;
  }

  .newsletter-compliance-note.is-ready{
    border-color:color-mix(in srgb,var(--gold) 32%,var(--rule));
    color:var(--ink-soft);
  }

  .book-affiliate-label{
    display:inline-block;
    margin-top:12px;
    color:var(--ink-faint);
    font-size:10.5px;
    font-weight:700;
    letter-spacing:.07em;
    text-transform:uppercase;
  }
'''
s = once(s, css_anchor, css_new, 'compliance css')

# State for public newsletter compliance details.
s = once(
    s,
    "let restoreBlogAfterPost = false;\n",
    "let restoreBlogAfterPost = false;\nlet newsletterCompliance = { configured:false, loaded:false, senderName:'Stephen Leynard', contactEmail:'hello@stephenleynard.com', mailingAddress:'' };\n",
    'newsletter compliance state'
)

# Add loader before account routing.
anchor = '''function isAuthed(){
  return isOwner();
}

function goReaderAccount(){'''
insert = '''function isAuthed(){
  return isOwner();
}

async function loadNewsletterCompliance(){
  try{
    const response = await fetch('/api/newsletter-status', { cache:'no-store' });
    if(!response.ok) throw new Error(`Newsletter status ${response.status}`);
    const status = await response.json();
    newsletterCompliance = {
      configured:Boolean(status.configured),
      loaded:true,
      senderName:String(status.senderName || 'Stephen Leynard'),
      contactEmail:String(status.contactEmail || 'hello@stephenleynard.com'),
      mailingAddress:String(status.mailingAddress || '')
    };
  }catch(error){
    console.error('Could not load publication-email compliance status', error);
    newsletterCompliance = { ...newsletterCompliance, configured:false, loaded:true, mailingAddress:'' };
  }

  const optIn = document.getElementById('readerNewsletterOptIn');
  const note = document.getElementById('newsletterComplianceNote');
  if(optIn) optIn.disabled = !newsletterCompliance.configured;
  if(note){
    note.classList.toggle('is-ready', newsletterCompliance.configured);
    note.textContent = newsletterCompliance.configured
      ? `Publication emails are sent by ${newsletterCompliance.senderName} / Mind Over Matter. Contact: ${newsletterCompliance.contactEmail}. Mailing address: ${newsletterCompliance.mailingAddress}. You can unsubscribe at any time.`
      : 'Publication-email signup is temporarily unavailable while the required sender contact details are being configured. You can still create and use a reader account.';
  }
  return newsletterCompliance;
}

function goReaderAccount(){'''
s = once(s, anchor, insert, 'newsletter compliance loader')

# Ensure account route triggers the availability check.
s = once(
    s,
    "  const requestedMode = new URLSearchParams(location.search).get('mode');\n  pushRoute('/account');",
    "  const requestedMode = new URLSearchParams(location.search).get('mode');\n  pushRoute('/account');\n  loadNewsletterCompliance();",
    'account compliance load'
)

# Consent version and fail closed if a stale DOM/browser somehow submits opt-in while unavailable.
s = once(
    s,
    "  const newsletterOptIn = document.getElementById('readerNewsletterOptIn').checked;",
    "  const newsletterOptIn = document.getElementById('readerNewsletterOptIn').checked && newsletterCompliance.configured;",
    'signup newsletter opt-in guard'
)
s = once(s, "newsletter_consent_version:'2026-08-15'", "newsletter_consent_version:'2026-08-16'", 'signup consent version')

# Preference UI: allow unsubscribe even if sending is unavailable, but do not allow new opt-in.
old_update = '''function updateNewsletterPreferenceUI(){
  const enabled = document.getElementById('readerNewsletterEnabled').checked;
  document.getElementById('readerNewsletterEssays').disabled = !enabled;
  document.getElementById('readerNewsletterBooks').disabled = !enabled;
  document.getElementById('readerNewsletterTopics').hidden = !enabled;
  document.getElementById('readerNewsletterOffNote').hidden = enabled;
}'''
new_update = '''function updateNewsletterPreferenceUI(){
  const master = document.getElementById('readerNewsletterEnabled');
  const enabled = master.checked;
  master.disabled = !newsletterCompliance.configured && !enabled;
  document.getElementById('readerNewsletterEssays').disabled = !enabled;
  document.getElementById('readerNewsletterBooks').disabled = !enabled;
  document.getElementById('readerNewsletterTopics').hidden = !enabled;
  document.getElementById('readerNewsletterOffNote').hidden = enabled;
}'''
s = once(s, old_update, new_update, 'newsletter preference UI')

# When loading preferences, also resolve compliance status before setting controls.
s = once(
    s,
    "  status.textContent = 'Loading your email preferences…';\n  try{",
    "  status.textContent = 'Loading your email preferences…';\n  await loadNewsletterCompliance();\n  try{",
    'load preferences compliance'
)
s = once(
    s,
    "    status.textContent = preference.subscribed\n      ? 'Publication emails are on. Choose the updates you want, then save.'\n      : 'Publication emails are off.';",
    "    status.textContent = preference.subscribed\n      ? (newsletterCompliance.configured ? 'Publication emails are on. Choose the updates you want, then save.' : 'Publication emails are currently paused because sender contact details are incomplete. You may turn them off now; they will not be sent until configuration is complete.')\n      : (newsletterCompliance.configured ? 'Publication emails are off.' : 'Publication emails are off. New opt-in is temporarily unavailable while sender contact details are configured.');",
    'preference status disclosure'
)

# Stop attempted re-opt-in without configured sender details.
s = once(
    s,
    "  const subscribed = document.getElementById('readerNewsletterEnabled').checked;\n  const essays",
    "  const subscribed = document.getElementById('readerNewsletterEnabled').checked;\n  if(subscribed && !newsletterCompliance.configured){\n    document.getElementById('readerNewsletterEnabled').checked = false;\n    updateNewsletterPreferenceUI();\n    status.textContent = 'Publication-email signup is temporarily unavailable while sender contact details are being configured.';\n    return;\n  }\n  const essays",
    'save preference compliance guard'
)

# Proximity disclosures on Amazon book links.
s = once(
    s,
    '''          <div class="book-card-actions ${link ? '' : 'single'}">
            <button class="btn btn-primary" type="button" onclick="openBookReview(${book.id})">Read review</button>
            ${link ? `<a class="btn btn-outline" href="${escapeHtml(link)}" target="_blank" rel="${rel}">${amazonLink ? 'View on Amazon' : 'View book'} <span aria-hidden="true">&rarr;</span></a>` : ''}
          </div>''',
    '''          ${amazonLink ? '<span class="book-affiliate-label">Affiliate link · commission may be earned</span>' : ''}
          <div class="book-card-actions ${link ? '' : 'single'}">
            <button class="btn btn-primary" type="button" onclick="openBookReview(${book.id})">Read review</button>
            ${link ? `<a class="btn btn-outline" href="${escapeHtml(link)}" target="_blank" rel="${rel}">${amazonLink ? 'View on Amazon' : 'View book'} <span aria-hidden="true">&rarr;</span></a>` : ''}
          </div>''',
    'book affiliate proximity disclosure'
)

texts['index'] = s

# Privacy Policy: current date, designated Privacy Officer, access/correction and complaint process, federal cross-border law note.
p = texts['privacy']
p = p.replace('Effective: August 15, 2026 · Last updated: August 15, 2026', 'Effective: August 15, 2026 · Last updated: August 16, 2026')
p = once(
    p,
    '''This policy is intended to describe the Site's actual practices clearly and to support compliance with applicable Canadian and British Columbia privacy requirements, including British Columbia's <em>Personal Information Protection Act</em> where applicable.''',
    '''This policy is intended to describe the Site's actual practices clearly and to support compliance with applicable Canadian and British Columbia privacy requirements, including British Columbia's <em>Personal Information Protection Act</em> (PIPA) and, for commercial cross-border personal-information flows, the federal <em>Personal Information Protection and Electronic Documents Act</em> (PIPEDA) where applicable.''',
    'privacy law scope'
)
p = once(
    p,
    '''<div class="box"><strong>Privacy contact:</strong> Stephen Leynard · <a href="mailto:hello@stephenleynard.com">hello@stephenleynard.com</a><br>Use this address for privacy questions, access or correction requests, account-deletion requests, consent withdrawals, or privacy complaints.</div>''',
    '''<div class="box"><strong>Privacy Officer:</strong> Stephen Leynard · <a href="mailto:hello@stephenleynard.com">hello@stephenleynard.com</a><br>Stephen Leynard is the individual designated to oversee the Site's privacy compliance. Use this address for privacy questions, written access or correction requests, account-deletion requests, consent withdrawals, or privacy complaints.</div>''',
    'privacy officer designation'
)
p = once(
    p,
    '''<h2>12. Access, correction, and account deletion</h2>
<p>Subject to applicable legal exceptions and identity verification, you may request access to personal information about you under my control or ask that inaccurate or incomplete information be corrected. Signed-in readers can permanently delete their own reader account directly from <strong>My Reader Account</strong>. You may also contact <a href="mailto:hello@stephenleynard.com">hello@stephenleynard.com</a> for an account-deletion or privacy request.</p>''',
    '''<h2>12. Access, correction, and account deletion</h2>
<p>Subject to applicable legal exceptions and reasonable identity verification, you may request access to personal information about you under my control or ask that inaccurate or incomplete information be corrected. For a formal access or correction request, send a written request to the Privacy Officer at <a href="mailto:hello@stephenleynard.com">hello@stephenleynard.com</a> with enough detail to identify you and the information involved. Requests will be handled as accurately and completely as reasonably possible and, where B.C. PIPA applies, a response will normally be provided within 30 days unless a lawful extension or other statutory rule applies.</p>
<p>Signed-in readers can permanently delete their own reader account directly from <strong>My Reader Account</strong>. You may also contact the Privacy Officer for an account-deletion or privacy request.</p>''',
    'privacy access process'
)
p = once(
    p,
    '''<h2>15. Privacy questions and complaints</h2>
<p>Please contact me first at <a href="mailto:hello@stephenleynard.com">hello@stephenleynard.com</a> so I can investigate a concern. Depending on the circumstances, you may also have the right to contact the <a href="https://www.oipc.bc.ca/" target="_blank" rel="noopener noreferrer">Office of the Information and Privacy Commissioner for British Columbia</a> or another privacy regulator with jurisdiction.</p>''',
    '''<h2>15. Privacy questions and complaints</h2>
<p>Privacy complaints should be sent to the Privacy Officer at <a href="mailto:hello@stephenleynard.com">hello@stephenleynard.com</a>. I will acknowledge and investigate the concern, review the relevant Site practices and records, and communicate the outcome or any corrective steps that are appropriate. If the issue is not resolved, or if applicable law permits, you may contact the <a href="https://www.oipc.bc.ca/" target="_blank" rel="noopener noreferrer">Office of the Information and Privacy Commissioner for British Columbia</a>, the <a href="https://www.priv.gc.ca/" target="_blank" rel="noopener noreferrer">Office of the Privacy Commissioner of Canada</a>, or another regulator with jurisdiction.</p>''',
    'privacy complaint process'
)
texts['privacy'] = p

# Terms: current date and electronic communications section.
t = texts['terms']
t = t.replace('Effective: August 15, 2026 · Last updated: August 15, 2026', 'Effective: August 15, 2026 · Last updated: August 16, 2026')
t = once(
    t,
    '''<h2>7. Third-party sites and services</h2>''',
    '''<h2>7. Publication emails</h2><p>Publication emails are optional. They are sent only where the Site has a lawful basis to send them, and readers may withdraw consent through the unsubscribe mechanism in the message or through their reader-account preferences. Required sender-identification and contact information is included in publication emails. Reader-account or security messages that are necessary to provide a requested account service may be treated separately where permitted by law.</p><h2>8. Third-party sites and services</h2>''',
    'terms publication emails'
)
# Renumber remaining headings 8-15 to 9-16, from the end backwards to avoid collisions.
for old_num, new_num in [(15,16),(14,15),(13,14),(12,13),(11,12),(10,11),(9,10),(8,9)]:
    t = t.replace(f'<h2>{old_num}. ', f'<h2>{new_num}. ', 1)
texts['terms'] = t

# Affiliate disclosure: current date and explicitly state link-level notices.
a = texts['affiliate']
a = a.replace('Effective: August 15, 2026 · Last updated: August 15, 2026', 'Effective: August 15, 2026 · Last updated: August 16, 2026')
a = once(
    a,
    '''<h2>Identification of material connections</h2><p>Where a post, recommendation, review, or other endorsement has a material connection that a reader would not reasonably expect—including an affiliate commission, sponsorship, free product, discount, or other consideration—I will aim to disclose that connection clearly and in proximity to the relevant content, in addition to this general disclosure where appropriate.</p>''',
    '''<h2>Identification of material connections</h2><p>Where a post, recommendation, review, or other endorsement has a material connection that a reader would not reasonably expect—including an affiliate commission, sponsorship, free product, discount, or other consideration—the Site uses clear, plain-language disclosure in proximity to the relevant content or link, in addition to this general disclosure where appropriate. Amazon links are marked as affiliate/sponsored links in the interface and in link metadata where technically appropriate.</p>''',
    'affiliate proximity language'
)
texts['affiliate'] = a

# Email sender compliance: public mailing address must be deliberately configured, and only that value is sent to subscribers.
n = texts['notify']
n = once(
    n,
    "  const required = ['RESEND_API_KEY', 'NEWSLETTER_FROM', 'NEWSLETTER_MAILING_ADDRESS'];",
    "  const required = ['RESEND_API_KEY', 'NEWSLETTER_FROM', 'NEWSLETTER_PUBLIC_MAILING_ADDRESS'];",
    'notify required mailing address'
)
n = once(
    n,
    "...emailFor({ type, item, subscriber, siteUrl, mailingAddress: env.NEWSLETTER_MAILING_ADDRESS, fromName })",
    "...emailFor({ type, item, subscriber, siteUrl, mailingAddress: env.NEWSLETTER_PUBLIC_MAILING_ADDRESS, fromName })",
    'notify public mailing address'
)
texts['notify'] = n

for name, text in texts.items():
    FILES[name].write_text(text, encoding='utf-8')

print('Final compliance pass applied.')
