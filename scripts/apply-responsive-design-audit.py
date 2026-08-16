from pathlib import Path

path = Path('index.html')
s = path.read_text(encoding='utf-8')

marker = '/* RESPONSIVE DESIGN AUDIT 2026-08-16 */'
if marker in s:
    raise SystemExit('Responsive design audit already applied')

old_consent = '''          <label class="consent-label" for="readerNewsletterOptIn">
            <input type="checkbox" id="readerNewsletterOptIn">
            <span><strong>Email me publication updates.</strong> Send me an email when Mind Over Matter publishes a new essay or book recommendation. This is optional; I can unsubscribe at any time.</span>
          </label>
          <p class="signup-legal-note" id="readerSignupLegalNotice">By creating a reader account, you agree to the <a href="/terms">Terms of Use</a> and acknowledge the <a href="/privacy">Privacy Policy</a>. Publication emails are optional and require the separate choice above.</p>'''
new_consent = '''          <label class="consent-label" for="readerNewsletterOptIn">
            <input type="checkbox" id="readerNewsletterOptIn">
            <span><strong>Email me publication updates</strong>Receive one email when a new Mind Over Matter essay or book recommendation is published. Optional — unsubscribe anytime.</span>
          </label>
          <p class="signup-legal-note" id="readerSignupLegalNotice">By creating a reader account, you agree to the <a href="/terms">Terms of Use</a> and acknowledge the <a href="/privacy">Privacy Policy</a>. Email updates stay off unless you select the option above.</p>'''
if s.count(old_consent) != 1:
    raise SystemExit(f'Consent block mismatch: found {s.count(old_consent)}')
s = s.replace(old_consent, new_consent, 1)

css = r'''

  /* RESPONSIVE DESIGN AUDIT 2026-08-16
     Small, system-level refinements for spacing, reading comfort, and visual balance. */
  :root{
    --ambient-gold:color-mix(in srgb,var(--gold) 4%,transparent);
    --ambient-gold-soft:color-mix(in srgb,var(--gold) 3%,transparent);
  }

  body{
    background:
      radial-gradient(1400px 760px at 50% -180px,var(--ambient-gold),transparent 74%),
      var(--bg);
  }

  /* Keep ambience broad and quiet instead of using small localized gold patches. */
  #view-blog-list,
  #view-books{
    background:linear-gradient(180deg,color-mix(in srgb,var(--gold) 3%,var(--bg-deep)) 0,var(--bg) 420px,var(--bg) 100%);
  }

  .blog-hero{
    background:linear-gradient(180deg,color-mix(in srgb,var(--gold) 4%,var(--bg-deep)),var(--bg-deep));
  }

  .featured-post{
    background:var(--panel);
  }

  .book-cover,
  .book-review-visual{
    background:linear-gradient(155deg,color-mix(in srgb,var(--panel-raise) 96%,var(--gold) 4%),var(--bg-deep));
  }

  /* More consistent vertical rhythm on long-form/list pages. */
  .blog-tools{
    padding-top:clamp(26px,3vw,34px);
  }

  .blog-wrap{
    padding-top:clamp(34px,4.5vw,48px);
    padding-bottom:clamp(82px,8vw,112px);
  }

  .featured-post{
    margin-bottom:clamp(18px,2.5vw,26px);
  }

  .post-list{
    gap:clamp(16px,2vw,22px);
  }

  .directory-wrap{
    padding-top:clamp(50px,6vw,66px);
    padding-bottom:clamp(84px,8vw,112px);
  }

  .directory-hero{
    gap:clamp(26px,4vw,42px);
    padding-bottom:clamp(30px,4vw,40px);
  }

  .directory-tools{
    margin-top:clamp(26px,3vw,34px);
    margin-bottom:16px;
  }

  .book-grid{
    gap:clamp(16px,2vw,22px);
    margin-top:28px;
  }

  .book-card-body{
    padding:clamp(21px,2.5vw,25px);
  }

  .book-card h2,
  .resource-card h3{
    line-height:1.16;
  }

  .blog-hero p,
  .directory-hero p,
  .book-description,
  .resource-card p,
  .directory-side-note,
  .resource-note-copy,
  .about-note-copy p,
  .affiliate-notice,
  .book-disclosure{
    line-height:1.72;
  }

  /* Forms and account screens: separate primary choices from explanatory/legal copy. */
  .login-card.account-card{
    max-width:620px;
  }

  .field{
    margin-bottom:18px;
  }

  .field label{
    margin-bottom:7px;
  }

  .signup-consent{
    margin:6px 0 22px;
    padding:18px;
    border-radius:14px;
    background:color-mix(in srgb,var(--panel) 97%,var(--gold) 3%);
  }

  .consent-label{
    grid-template-columns:22px minmax(0,1fr);
    gap:13px;
    font-size:13.25px;
    line-height:1.68;
  }

  .consent-label input{
    width:19px;
    height:19px;
    margin-top:2px;
  }

  .consent-label strong{
    display:block;
    margin-bottom:4px;
    color:var(--ink);
    font-size:13.5px;
    line-height:1.45;
  }

  .signup-legal-note{
    margin:17px 0 0;
    padding-top:15px;
    border-top:1px solid var(--rule);
    font-size:12px;
    line-height:1.72;
  }

  .auth-switch{
    margin-top:20px;
    font-size:12.5px;
    line-height:1.6;
    text-align:center;
  }

  .reader-preferences{
    margin-top:28px;
    padding-top:30px;
  }

  .preference-intro{
    margin-bottom:22px;
  }

  .preference-intro p{
    line-height:1.7;
  }

  .preference-master{
    padding:19px 18px;
    background:color-mix(in srgb,var(--panel) 96%,var(--gold) 4%);
  }

  .preference-copy small,
  .preference-choice small{
    display:block;
    margin-top:4px;
    line-height:1.58;
  }

  .preference-topics{
    margin-top:16px;
    padding:7px 18px;
  }

  .preference-choice{
    padding:15px 0;
    gap:20px;
  }

  .preference-off-note{
    line-height:1.68;
  }

  .preference-actions{
    margin-top:20px;
  }

  .reader-danger-zone{
    margin-top:32px;
    padding-top:26px;
  }

  /* Secondary explanatory blocks should breathe like editorial copy, not UI labels. */
  .about-disclaimer,
  .about-editorial-note,
  .resource-note,
  .affiliate-notice{
    line-height:1.7;
  }

  .footer-links{
    row-gap:10px;
  }

  .footer-copyright,
  .footer-disclaimer{
    line-height:1.55;
  }

  /* Tablet: preserve two-column layouts where useful, but use matching gutters. */
  @media (min-width:701px) and (max-width:1024px){
    .blog-tools,
    .blog-wrap,
    .directory-wrap,
    .about-wrap,
    .admin-wrap,
    .editor-wrap{
      padding-left:24px;
      padding-right:24px;
    }

    .post-list,
    .book-grid,
    .resource-grid{
      gap:16px;
    }

    .footer-links{
      gap:10px 15px;
      flex-wrap:wrap;
      justify-content:flex-start;
    }
  }

  /* Phone: keep the same hierarchy while protecting usable text width. */
  @media (max-width:700px){
    .blog-tools{ padding:22px 16px 0; }
    .blog-wrap{ padding:30px 16px 76px; }
    .featured-post{ margin-bottom:14px; }

    .directory-wrap{ padding:34px 16px 76px; }
    .directory-hero{ gap:16px; padding-bottom:22px; }
    .directory-tools{ margin-top:22px; }
    .book-grid{ gap:14px; margin-top:24px; }
    .book-card-body{ padding:22px 20px 24px; }

    .login-card.account-card{
      padding:28px 20px 24px;
    }

    .field{ margin-bottom:17px; }

    .signup-consent{
      margin-top:4px;
      margin-bottom:20px;
      padding:15px;
      border-radius:14px;
    }

    .consent-label{
      grid-template-columns:21px minmax(0,1fr);
      gap:12px;
      font-size:13px;
      line-height:1.66;
    }

    .consent-label strong{
      margin-bottom:5px;
      font-size:13.25px;
    }

    .signup-legal-note{
      margin-top:15px;
      padding-top:14px;
      font-size:11.75px;
      line-height:1.7;
    }

    .auth-switch{
      margin-top:18px;
      font-size:12.25px;
    }

    .reader-preferences{
      margin-top:25px;
      padding-top:26px;
    }

    .preference-intro{ margin-bottom:19px; }
    .preference-master{ padding:17px 16px; }
    .preference-topics{ padding:5px 16px; }
    .preference-choice{ padding:14px 0; gap:14px; }
    .reader-danger-zone{ margin-top:28px; padding-top:24px; }

    .directory-side-note,
    .resource-note-copy,
    .affiliate-notice,
    .book-disclosure{
      line-height:1.66;
    }
  }

  @media (max-width:430px){
    .login-card.account-card{ padding-left:18px; padding-right:18px; }
    .signup-consent{ padding:14px; }
    .consent-label{ gap:11px; }
  }
'''

closing = '\n</style>\n</head>'
if s.count(closing) != 1:
    raise SystemExit(f'Style closing marker mismatch: found {s.count(closing)}')
s = s.replace(closing, css + closing, 1)

path.write_text(s, encoding='utf-8')
print('Responsive design audit applied.')
