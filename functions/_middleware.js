const SITE_URL = 'https://stephenleynard.com';

const SPA_PUBLIC_ROUTES = {
  '/blog': {
    title: 'Psychology Essays | Mind Over Matter',
    description: 'Read original psychology essays by Stephen Leynard on human behaviour, mental health, relationships, addiction, and everyday life.'
  },
  '/books': {
    title: 'Psychology Book Recommendations | Mind Over Matter',
    description: 'Explore psychology and mental-health books personally read and recommended by Stephen Leynard.'
  },
  '/resources': {
    title: 'Mental Health and Crisis Resources | Mind Over Matter',
    description: 'Find verified crisis, mental-health, and support resources for Canada, British Columbia, Vancouver Island, the United States, and beyond.'
  },
  '/about': {
    title: 'About Stephen Leynard | Mind Over Matter',
    description: 'Learn about Stephen Leynard, the psychology graduate and writer behind Mind Over Matter.'
  }
};

const ACCOUNT_SELECTORS = [
  '#view-account'
];

const ADMIN_SELECTORS = [
  '#view-login',
  '#view-dashboard',
  '#view-book-editor',
  '#view-editor',
  '#deleteModal',
  '#bookDeleteModal'
];

class RemoveElement {
  element(element) {
    element.remove();
  }
}

class SetText {
  constructor(value) {
    this.value = value;
  }

  element(element) {
    element.setInnerContent(this.value);
  }
}

class SetAttribute {
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }

  element(element) {
    element.setAttribute(this.name, this.value);
  }
}

class AddBodyClass {
  constructor(className) {
    this.className = className;
  }

  element(element) {
    const current = element.getAttribute('class') || '';
    const classes = new Set(current.split(/\s+/).filter(Boolean));
    classes.add(this.className);
    element.setAttribute('class', Array.from(classes).join(' '));
  }
}

class LegalHeadAssets {
  element(element) {
    element.append(
      `<link rel="preconnect" href="https://fonts.googleapis.com">` +
      `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>` +
      `<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,450;0,9..144,600;0,9..144,700;1,9..144,450;1,9..144,600&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">`,
      { html: true }
    );
  }
}

class SharedChromeStyles {
  element(element) {
    element.append(
      `<style id="shared-site-chrome-styles">\n` +
      `.back-to-top{position:fixed;right:18px;bottom:calc(18px + env(safe-area-inset-bottom));z-index:460;width:42px;height:42px;display:grid;place-items:center;border:1px solid var(--rule,rgba(170,162,147,.35));border-radius:50%;background:var(--panel,rgba(21,19,15,.9));color:var(--ink,#efe9d8);box-shadow:0 8px 26px rgba(0,0,0,.16);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);opacity:0;visibility:hidden;pointer-events:none;transform:translateY(8px);transition:opacity .2s ease,transform .2s ease,visibility .2s ease,border-color .2s ease,background .2s ease;cursor:pointer;}\n` +
      `.back-to-top.is-visible{opacity:.76;visibility:visible;pointer-events:auto;transform:translateY(0);}\n` +
      `.back-to-top:hover,.back-to-top:focus-visible{opacity:1;border-color:var(--gold,#b89b4a);outline:none;}\n` +
      `.back-to-top svg{width:18px;height:18px;display:block;}\n` +

      `body.standalone-legal{` +
      `--bg:#0C0B09;--bg-deep:#060605;--panel:#17150F;--panel-raise:#1D1A13;--ink:#EFE9D8;--ink-soft:#B3AA95;--ink-faint:#726A57;--rule:#2A2619;--gold:#B89B4A;--gold-dk:#927A38;--gold-15:rgba(184,155,74,.16);--gold-soft:#D8C078;--danger:#B4463B;--on-accent:#151208;--nav-glass:rgba(10,9,7,.86);--panel-glass:rgba(23,21,15,.84);--shadow-pop:0 24px 70px rgba(0,0,0,.48);--font-display:'Fraunces',Georgia,serif;--font-body:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;--nav-h:72px;--radius:12px;` +
      `margin:0!important;min-height:100vh;background:radial-gradient(900px 620px at 7% 10%,var(--gold-15),transparent 70%),var(--bg)!important;color:var(--ink)!important;font-family:var(--font-body)!important;-webkit-font-smoothing:antialiased;}\n` +
      `html[data-theme="light"] body.standalone-legal{--bg:#F7F3E9;--bg-deep:#EEE7D7;--panel:#FFFCF5;--panel-raise:#F1E9D9;--ink:#211D16;--ink-soft:#625A4B;--ink-faint:#817664;--rule:#D8CFBD;--gold:#B89B4A;--gold-dk:#927A38;--gold-15:rgba(184,155,74,.16);--gold-soft:#D8C078;--danger:#9F332D;--on-accent:#FFFCF5;--nav-glass:rgba(247,243,233,.88);--panel-glass:rgba(255,252,245,.88);--shadow-pop:0 24px 70px rgba(44,35,21,.18);}\n` +
      `body.standalone-legal button,body.standalone-legal a{font-family:inherit;-webkit-tap-highlight-color:transparent;}\n` +
      `body.standalone-legal main{max-width:800px!important;margin:0 auto!important;padding:calc(var(--nav-h) + 48px) 24px 100px!important;}\n` +
      `body.standalone-legal main a{color:var(--gold-soft)!important;}\n` +
      `body.standalone-legal main .box{background:var(--panel)!important;border-color:var(--rule)!important;}\n` +
      `body.standalone-legal main .muted{color:var(--ink-faint)!important;}\n` +

      `body.standalone-legal .topnav{position:fixed;top:0;left:0;right:0;height:var(--nav-h);z-index:500;display:flex;align-items:center;justify-content:space-between;padding:0 clamp(18px,4vw,54px);background:var(--nav-glass);border:0;border-bottom:1px solid color-mix(in srgb,var(--rule) 82%,transparent);box-shadow:0 8px 30px rgba(0,0,0,.06);backdrop-filter:blur(18px) saturate(125%);-webkit-backdrop-filter:blur(18px) saturate(125%);font-family:var(--font-body);}\n` +
      `body.standalone-legal .topnav .brand{display:flex;align-items:center;gap:10px;font-family:var(--font-display);font-weight:600;font-style:italic;font-size:21px;letter-spacing:.2px;color:var(--ink)!important;text-decoration:none;cursor:pointer;}\n` +
      `body.standalone-legal .topnav .brand-logo{width:43px;height:43px;object-fit:contain;flex:none;filter:saturate(.82) brightness(.88) drop-shadow(0 2px 5px rgba(184,155,74,.18));transition:filter .2s ease,transform .2s ease;}\n` +
      `body.standalone-legal .topnav .brand:hover .brand-logo{transform:scale(1.04);}\n` +
      `body.standalone-legal .topnav .brand-title{display:inline-block;white-space:nowrap;word-spacing:normal;}\n` +
      `body.standalone-legal .topnav .brand .mark{color:var(--gold);}\n` +
      `body.standalone-legal .nav-actions{display:flex;align-items:center;gap:5px;}\n` +
      `body.standalone-legal .nav-btn{min-height:38px;border:1px solid var(--rule);background:transparent;color:var(--ink-soft)!important;padding:8px 12px;border-radius:999px;font-size:13.5px;font-weight:600;letter-spacing:.01em;line-height:normal;text-decoration:none;transition:background-color .18s ease,color .18s ease,border-color .18s ease,transform .18s ease;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;}\n` +
      `body.standalone-legal .nav-btn:hover{border-color:var(--gold);color:var(--gold-soft)!important;transform:translateY(-1px);}\n` +
      `body.standalone-legal .nav-btn:focus-visible{outline:2px solid var(--gold);outline-offset:3px;}\n` +
      `body.standalone-legal .nav-btn.ghost-danger{color:var(--danger)!important;}\n` +
      `body.standalone-legal .nav-btn.ghost-danger:hover{border-color:var(--danger);color:var(--danger)!important;}\n` +
      `body.standalone-legal .user-menu-label{max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}\n` +
      `body.standalone-legal .mobile-menu-toggle{display:none;width:40px;height:40px;padding:0;align-items:center;justify-content:center;}\n` +
      `body.standalone-legal .mobile-menu-toggle svg{width:20px;height:20px;}\n` +
      `body.standalone-legal .mobile-menu-toggle .menu-close-icon{display:none;}\n` +
      `body.standalone-legal .mobile-menu-toggle[aria-expanded="true"] .menu-open-icon{display:none;}\n` +
      `body.standalone-legal .mobile-menu-toggle[aria-expanded="true"] .menu-close-icon{display:block;}\n` +
      `body.standalone-legal .theme-toggle{width:40px;height:38px;padding:0;border-radius:999px;}\n` +
      `body.standalone-legal .theme-toggle svg{width:18px;height:18px;}\n` +
      `body.standalone-legal .theme-toggle .sun-icon{display:none;}\n` +
      `html[data-theme="light"] body.standalone-legal .theme-toggle .sun-icon{display:block;}\n` +
      `html[data-theme="light"] body.standalone-legal .theme-toggle .moon-icon{display:none;}\n` +
      `body.standalone-legal .theme-toggle-text{display:none;}\n` +

      `body.standalone-legal .site-footer{border-top:1px solid var(--rule);padding:42px 28px;background:var(--bg-deep);color:var(--ink-faint);font-family:var(--font-body);font-size:12px;}\n` +
      `body.standalone-legal .footer-inner{max-width:1180px;margin:0 auto;display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:clamp(18px,2.6vw,34px);}\n` +
      `body.standalone-legal .footer-brand{display:flex;align-items:center;gap:10px;min-width:0;white-space:nowrap;}\n` +
      `body.standalone-legal .footer-brand strong{color:var(--ink);}\n` +
      `body.standalone-legal .footer-links{display:flex;align-items:center;justify-content:center;gap:clamp(10px,1.35vw,17px);white-space:nowrap;color:var(--ink-soft);margin:0;}\n` +
      `body.standalone-legal .footer-links a,body.standalone-legal .footer-links button{color:inherit!important;text-decoration:none;}\n` +
      `body.standalone-legal .footer-links button{border:0;padding:0;background:none;font:inherit;cursor:pointer;}\n` +
      `body.standalone-legal .footer-links a:hover,body.standalone-legal .footer-links button:hover{color:var(--gold-soft)!important;}\n` +
      `body.standalone-legal .footer-copyright{display:flex;align-items:center;gap:8px;white-space:nowrap;}\n` +

      `@media(max-width:1120px){\n` +
      `body.standalone-legal .topnav{padding:0 14px;}\n` +
      `body.standalone-legal .topnav .brand{gap:7px;font-size:18px;letter-spacing:0;min-width:0;}\n` +
      `body.standalone-legal .topnav .brand-logo{width:34px;height:34px;}\n` +
      `body.standalone-legal .mobile-menu-toggle{display:inline-flex;flex:none;}\n` +
      `body.standalone-legal .nav-actions{position:fixed;top:calc(var(--nav-h) + 8px);left:12px;right:12px;z-index:510;max-height:calc(100dvh - var(--nav-h) - 18px);overflow-y:auto;overscroll-behavior:contain;display:flex;flex-direction:column;align-items:stretch;gap:6px;padding:10px;background:var(--panel);border:1px solid var(--rule);border-radius:8px;box-shadow:var(--shadow-pop);opacity:0;visibility:hidden;pointer-events:none;transform:translateY(-10px);transition:opacity .18s ease,transform .18s ease,visibility .18s ease;}\n` +
      `body.standalone-legal .nav-actions.open{opacity:1;visibility:visible;pointer-events:auto;transform:translateY(0);}\n` +
      `body.standalone-legal .nav-actions .nav-btn{width:100%;min-height:44px;padding:11px 14px;justify-content:flex-start;text-align:left;}\n` +
      `body.standalone-legal .nav-actions .theme-toggle{height:44px;gap:9px;}\n` +
      `body.standalone-legal .theme-toggle-text{display:inline;}\n` +
      `}\n` +

      `@media(max-width:900px) and (min-width:701px){\n` +
      `body.standalone-legal .footer-inner{grid-template-columns:minmax(0,1fr) auto;gap:16px 24px;}\n` +
      `body.standalone-legal .footer-brand{grid-column:1/-1;flex-wrap:wrap;white-space:normal;}\n` +
      `}\n` +

      `@media(max-width:700px){\n` +
      `body.standalone-legal{--nav-h:64px;overflow-wrap:anywhere;}\n` +
      `body.standalone-legal main{padding:calc(var(--nav-h) + 38px) 18px 78px!important;}\n` +
      `body.standalone-legal.nav-open{overflow:hidden;}\n` +
      `body.standalone-legal.nav-open::before{content:'';position:fixed;inset:var(--nav-h) 0 0;z-index:490;background:rgba(0,0,0,.44);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);}\n` +
      `body.standalone-legal .topnav{padding:0 13px;box-shadow:0 6px 24px rgba(0,0,0,.12);}\n` +
      `body.standalone-legal .topnav .brand{gap:7px;font-size:17.5px;line-height:1;}\n` +
      `body.standalone-legal .topnav .brand-logo{width:35px;height:35px;}\n` +
      `body.standalone-legal .mobile-menu-toggle{width:44px;height:44px;border-radius:50%;background:var(--panel);}\n` +
      `body.standalone-legal .nav-actions{top:calc(var(--nav-h) + 8px);left:10px;right:10px;max-height:calc(100dvh - var(--nav-h) - 18px);gap:4px;padding:9px 9px calc(9px + env(safe-area-inset-bottom));border-radius:19px;background:var(--panel-glass);box-shadow:0 22px 70px rgba(0,0,0,.38);backdrop-filter:blur(24px) saturate(130%);-webkit-backdrop-filter:blur(24px) saturate(130%);}\n` +
      `body.standalone-legal .nav-actions .nav-btn{min-height:49px;padding:12px 14px;border-radius:12px;font-size:14px;}\n` +
      `body.standalone-legal .nav-actions .theme-toggle{width:100%;height:49px;}\n` +

      `.site-footer{padding:22px 14px calc(22px + env(safe-area-inset-bottom))!important;}\n` +
      `.site-footer .footer-inner{width:100%;max-width:420px;margin:0 auto!important;display:grid!important;grid-template-columns:1fr!important;justify-items:center!important;align-items:center!important;gap:12px!important;text-align:center!important;}\n` +
      `.site-footer .footer-brand{display:flex!important;align-items:center!important;justify-content:center!important;width:100%!important;flex-direction:row!important;text-align:center!important;white-space:normal!important;}\n` +
      `.site-footer .footer-brand strong{font-size:12px!important;}\n` +
      `.site-footer .footer-links{width:min(100%,360px)!important;display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:2px 6px!important;justify-items:stretch!important;align-items:stretch!important;white-space:normal!important;}\n` +
      `.site-footer .footer-links a,.site-footer .footer-links button{min-height:34px!important;width:100%!important;display:flex!important;align-items:center!important;justify-content:center!important;padding:4px 3px!important;margin:0!important;text-align:center!important;line-height:1.18!important;border:0!important;background:transparent!important;color:inherit!important;font:inherit!important;font-size:11px!important;}\n` +
      `.site-footer .footer-links > :last-child{grid-column:auto!important;justify-self:stretch!important;width:100%!important;}\n` +
      `.site-footer .footer-copyright{width:100%!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:4px!important;flex-wrap:wrap!important;text-align:center!important;white-space:normal!important;font-size:10.5px!important;line-height:1.35!important;}\n` +
      `.back-to-top{right:13px;bottom:calc(13px + env(safe-area-inset-bottom));width:40px;height:40px;}\n` +
      `}\n` +

      `@media(max-width:370px){body.standalone-legal .topnav .brand{font-size:16px;}body.standalone-legal .topnav .brand-logo{width:32px;height:32px;}.site-footer .footer-links{gap:2px 3px!important}.site-footer .footer-links a,.site-footer .footer-links button{font-size:10px!important;padding-left:1px!important;padding-right:1px!important;}}\n` +
      `@media(hover:none) and (pointer:coarse){body.standalone-legal .nav-btn:hover{transform:none;}body.standalone-legal .nav-btn:active{transform:scale(.985);}}\n` +
      `@media(prefers-reduced-motion:reduce){.back-to-top{transition:none;}body.standalone-legal .nav-btn{transition-duration:.01ms!important;}}\n` +
      `</style>` +
      `<script>(function(){try{var saved=localStorage.getItem('mindovermatter_theme');var theme=saved==='light'||saved==='dark'?saved:(window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');document.documentElement.dataset.theme=theme;}catch(e){}})();</script>`,
      { html: true }
    );
  }
}

class BackToTopControl {
  element(element) {
    element.append(
      `<button class="back-to-top" id="backToTop" type="button" aria-label="Back to top" title="Back to top">` +
      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 15l-6-6-6 6"/></svg>` +
      `</button>` +
      `<script>(function(){var b=document.getElementById('backToTop');if(!b)return;var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;var update=function(){b.classList.toggle('is-visible',window.scrollY>520);};b.addEventListener('click',function(){window.scrollTo({top:0,behavior:reduce?'auto':'smooth'});});window.addEventListener('scroll',update,{passive:true});update();})();</script>`,
      { html: true }
    );
  }
}

class LegalSiteShell {
  element(element) {
    element.before(
      `<nav class="topnav">` +
      `<div class="brand" id="legalBrand" role="link" tabindex="0" aria-label="Mind Over Matter home">` +
      `<img class="brand-logo" src="/brain-logo-v2.png" alt=""><span class="brand-title"><span class="mark">Mind</span> Over Matter</span></div>` +
      `<button class="nav-btn mobile-menu-toggle" id="legalMobileMenuToggle" type="button" aria-label="Open navigation menu" aria-expanded="false" aria-controls="legalNavActions">` +
      `<svg class="menu-open-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>` +
      `<svg class="menu-close-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>` +
      `</button>` +
      `<div class="nav-actions" id="legalNavActions">` +
      `<button class="nav-btn" type="button" data-route="/">Home</button>` +
      `<button class="nav-btn" type="button" data-route="/blog">Blog</button>` +
      `<button class="nav-btn" type="button" data-route="/books">Books</button>` +
      `<button class="nav-btn" type="button" data-route="/resources">Resources</button>` +
      `<button class="nav-btn" type="button" data-route="/about">About</button>` +
      `<button class="nav-btn" id="legalAccountBtn" type="button" data-route="/account">Reader sign in</button>` +
      `<button class="nav-btn" id="legalAdminBtn" type="button" data-route="/admin" style="display:none">Admin</button>` +
      `<button class="nav-btn theme-toggle" id="legalThemeToggle" type="button" aria-label="Switch to light theme" title="Switch to light theme">` +
      `<svg class="sun-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42"/></svg>` +
      `<svg class="moon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>` +
      `<span class="theme-toggle-text">Theme</span></button>` +
      `<button class="nav-btn ghost-danger" id="legalLogoutBtn" type="button" style="display:none">Log out</button>` +
      `</div></nav>` +
      `<script>(function(){` +
      `var AUTH_KEY='mindovermatter_auth_session',ADMIN_ID='e21f3af3-0afb-41e4-a84f-5b8f10d7f37b',SUPABASE_AUTH='https://ljseqpciuohncchdcewa.supabase.co/auth/v1/',SUPABASE_KEY='sb_publishable_cWKtBkdbEFnbtJYV0Ttt0w_rn42Hx-k';` +
      `var brand=document.getElementById('legalBrand'),toggle=document.getElementById('legalMobileMenuToggle'),nav=document.getElementById('legalNavActions'),theme=document.getElementById('legalThemeToggle'),account=document.getElementById('legalAccountBtn'),admin=document.getElementById('legalAdminBtn'),logout=document.getElementById('legalLogoutBtn');` +
      `function getSession(){try{return JSON.parse(localStorage.getItem(AUTH_KEY))||null}catch(e){localStorage.removeItem(AUTH_KEY);return null}}` +
      `function signedIn(){return !!getSession()?.access_token}` +
      `function owner(){return getSession()?.user?.id===ADMIN_ID}` +
      `function go(path){location.assign(path);}` +
      `function close(){if(!toggle||!nav)return;toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open navigation menu');nav.classList.remove('open');document.body.classList.remove('nav-open');}` +
      `function syncAccount(){var signed=signedIn();if(account){account.innerHTML=signed?'<span class="user-menu-label">My Reader Account</span>':'Reader sign in';account.setAttribute('aria-label',signed?'Open my reader account':'Reader sign in');account.setAttribute('title',signed?'Open my reader account':'Reader sign in');}if(admin)admin.style.display=owner()?'inline-flex':'none';if(logout)logout.style.display=signed?'inline-flex':'none';}` +
      `if(brand){brand.addEventListener('click',function(){go('/')});brand.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();go('/');}});}` +
      `document.querySelectorAll('#legalNavActions [data-route]').forEach(function(b){b.addEventListener('click',function(){go(b.getAttribute('data-route'));});});` +
      `if(toggle&&nav){toggle.addEventListener('click',function(e){e.stopPropagation();var open=toggle.getAttribute('aria-expanded')==='true';toggle.setAttribute('aria-expanded',String(!open));toggle.setAttribute('aria-label',open?'Open navigation menu':'Close navigation menu');nav.classList.toggle('open',!open);document.body.classList.toggle('nav-open',!open);});document.addEventListener('click',function(e){if(toggle.getAttribute('aria-expanded')==='true'&&!nav.contains(e.target)&&!toggle.contains(e.target))close();});window.addEventListener('resize',function(){if(window.innerWidth>1120)close();});document.addEventListener('keydown',function(e){if(e.key==='Escape')close();});}` +
      `function syncThemeLabel(){if(!theme)return;var light=document.documentElement.dataset.theme==='light';theme.setAttribute('aria-label',light?'Switch to dark theme':'Switch to light theme');theme.setAttribute('title',light?'Switch to dark theme':'Switch to light theme');}` +
      `if(theme){syncThemeLabel();theme.addEventListener('click',function(){var next=document.documentElement.dataset.theme==='light'?'dark':'light';document.documentElement.dataset.theme=next;try{localStorage.setItem('mindovermatter_theme',next);}catch(e){}syncThemeLabel();close();});}` +
      `if(logout){logout.addEventListener('click',function(){var session=getSession();localStorage.removeItem(AUTH_KEY);sessionStorage.removeItem('mycms_authed');if(session?.access_token){fetch(SUPABASE_AUTH+'logout',{method:'POST',headers:{apikey:SUPABASE_KEY,Authorization:'Bearer '+session.access_token}}).catch(function(){});}go('/');});}` +
      `syncAccount();` +
      `})();</script>`,
      { html: true }
    );

    element.after(
      `<footer class="site-footer">` +
      `<div class="footer-inner">` +
      `<div class="footer-brand"><strong>Mind Over Matter</strong></div>` +
      `<nav class="footer-links" aria-label="Footer navigation">` +
      `<a href="/">Home</a>` +
      `<a href="/blog">Blog</a>` +
      `<a href="/books">Books</a>` +
      `<a href="/resources">Resources</a>` +
      `<a href="/about">About</a>` +
      `<a href="/privacy">Privacy Policy</a>` +
      `<a href="/terms">Terms of Use</a>` +
      `<a href="/affiliate-disclosure">Affiliate Disclosure</a>` +
      `<button type="button" onclick="location.href='mailto:hello@stephenleynard.com?subject=Mind%20Over%20Matter'">Contact</button>` +
      `</nav>` +
      `<div class="footer-copyright"><span>© <span>2026</span> Stephen Leynard</span><span aria-hidden="true">·</span><span>All rights reserved.</span></div>` +
      `</div></footer>`,
      { html: true }
    );
  }
}

function normalizedPath(pathname) {
  if (pathname === '/') return '/';
  return pathname.replace(/\/+$/, '') || '/';
}

export async function onRequest(context) {
  const response = await context.next();
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.toLowerCase().includes('text/html')) return response;

  const url = new URL(context.request.url);
  const path = normalizedPath(url.pathname);
  const accountShell = path === '/account';
  const adminShell = path === '/admin';
  const standaloneLegalPage = path === '/privacy' || path === '/terms' || path === '/affiliate-disclosure';
  const routeMeta = SPA_PUBLIC_ROUTES[path];

  let rewriter = new HTMLRewriter()
    .on('head', new SharedChromeStyles())
    .on('body', new BackToTopControl());

  if (standaloneLegalPage) {
    rewriter = rewriter
      .on('head', new LegalHeadAssets())
      .on('body', new AddBodyClass('standalone-legal'))
      .on('main nav', new RemoveElement())
      .on('main footer', new RemoveElement())
      .on('main', new LegalSiteShell());
  }

  if (!standaloneLegalPage) {
    if (!accountShell) {
      for (const selector of ACCOUNT_SELECTORS) {
        rewriter = rewriter.on(selector, new RemoveElement());
      }
    }
    if (!adminShell) {
      for (const selector of ADMIN_SELECTORS) {
        rewriter = rewriter.on(selector, new RemoveElement());
      }
    }
  }

  if (routeMeta) {
    const canonical = `${SITE_URL}${path}`;
    rewriter = rewriter
      .on('title', new SetText(routeMeta.title))
      .on('meta[name="description"]', new SetAttribute('content', routeMeta.description))
      .on('meta[name="robots"]', new SetAttribute('content', 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'))
      .on('meta[property="og:title"]', new SetAttribute('content', routeMeta.title))
      .on('meta[property="og:description"]', new SetAttribute('content', routeMeta.description))
      .on('meta[property="og:url"]', new SetAttribute('content', canonical))
      .on('meta[name="twitter:title"]', new SetAttribute('content', routeMeta.title))
      .on('meta[name="twitter:description"]', new SetAttribute('content', routeMeta.description))
      .on('link[rel="canonical"]', new SetAttribute('href', canonical));
  }

  return rewriter.transform(response);
}
