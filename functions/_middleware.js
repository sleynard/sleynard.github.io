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

const PRIVATE_SELECTORS = [
  '#view-account',
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

class PrivateRouteGuard {
  element(element) {
    element.append(
      `<script>(function(){\n` +
      `var account=window.goReaderAccount;if(typeof account==='function'){window.goReaderAccount=function(){if(!document.getElementById('view-account')){location.assign('/account');return;}return account.apply(this,arguments);};}\n` +
      `var admin=window.goAdminEntry;if(typeof admin==='function'){window.goAdminEntry=function(){if(!document.getElementById('view-login')){location.assign('/admin');return;}return admin.apply(this,arguments);};}\n` +
      `})();</script>`,
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

      `@media(max-width:700px){\n` +
      `.site-footer{padding:34px 18px calc(34px + env(safe-area-inset-bottom))!important;}\n` +
      `.site-footer .footer-inner{width:100%;max-width:560px;margin:0 auto!important;display:grid!important;grid-template-columns:1fr!important;justify-items:center!important;align-items:center!important;gap:20px!important;text-align:center!important;}\n` +
      `.site-footer .footer-brand{display:flex!important;align-items:center!important;justify-content:center!important;width:100%!important;text-align:center!important;}\n` +
      `.site-footer .footer-links{width:min(100%,430px)!important;display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px 12px!important;justify-items:stretch!important;align-items:stretch!important;white-space:normal!important;}\n` +
      `.site-footer .footer-links a,.site-footer .footer-links button{min-height:44px!important;width:100%!important;display:flex!important;align-items:center!important;justify-content:center!important;padding:8px 7px!important;margin:0!important;text-align:center!important;line-height:1.25!important;border:0!important;background:transparent!important;color:inherit!important;font:inherit!important;}\n` +
      `.site-footer .footer-links > :last-child{grid-column:1 / -1!important;justify-self:center!important;width:50%!important;}\n` +
      `.site-footer .footer-copyright{width:100%!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:6px!important;flex-wrap:wrap!important;text-align:center!important;white-space:normal!important;}\n` +
      `.back-to-top{right:13px;bottom:calc(13px + env(safe-area-inset-bottom));width:40px;height:40px;}\n` +
      `}\n` +

      `body.standalone-legal{--bg:#0c0b09;--bg-deep:#060605;--panel:#17150f;--panel-raise:#1d1a13;--ink:#efe9d8;--ink-soft:#b3aa95;--ink-faint:#726a57;--rule:#2a2619;--gold:#b89b4a;--gold-soft:#d8c078;--on-accent:#151208;--font-display:Georgia,serif;--font-body:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;--nav-h:64px;--radius:3px;background:var(--bg)!important;color:var(--ink)!important;font-family:var(--font-body)!important;}\n` +
      `html[data-theme="light"] body.standalone-legal{--bg:#f7f3e9;--bg-deep:#eee7d7;--panel:#fffcf5;--panel-raise:#f1e9d9;--ink:#211d16;--ink-soft:#625a4b;--ink-faint:#817664;--rule:#d8cfbd;--gold:#b89b4a;--gold-soft:#927a38;--on-accent:#fffcf5;}\n` +
      `body.standalone-legal main{max-width:800px!important;margin:0 auto!important;padding:calc(var(--nav-h) + 48px) 24px 100px!important;}\n` +
      `body.standalone-legal .topnav{position:fixed;top:0;left:0;right:0;height:var(--nav-h);z-index:500;display:flex;align-items:center;justify-content:space-between;padding:0 28px;background:var(--bg-deep);border-bottom:1px solid var(--rule);font-family:var(--font-body);}\n` +
      `body.standalone-legal .topnav .brand{display:flex;align-items:center;gap:9px;font-family:var(--font-display);font-weight:600;font-style:italic;font-size:20px;letter-spacing:.2px;color:var(--ink)!important;text-decoration:none;cursor:pointer;}\n` +
      `body.standalone-legal .topnav .brand-logo{width:40px;height:40px;object-fit:contain;flex:none;filter:saturate(.82) brightness(.88) drop-shadow(0 2px 5px rgba(184,155,74,.18));}\n` +
      `body.standalone-legal .topnav .brand-title{display:inline-block;white-space:nowrap;}\n` +
      `body.standalone-legal .topnav .brand .mark{color:var(--gold);}\n` +
      `body.standalone-legal .nav-actions{display:flex;align-items:center;gap:8px;}\n` +
      `body.standalone-legal .nav-btn{border:1px solid var(--rule);background:transparent;color:var(--ink-soft)!important;padding:9px 16px;border-radius:var(--radius);font-size:13.5px;font-weight:600;letter-spacing:.01em;text-decoration:none;transition:all .15s ease;display:inline-flex;align-items:center;justify-content:center;min-height:38px;}\n` +
      `body.standalone-legal .nav-btn:hover,body.standalone-legal .nav-btn:focus-visible{border-color:var(--gold);color:var(--gold-soft)!important;}\n` +
      `body.standalone-legal .mobile-menu-toggle{display:none;width:40px;height:40px;padding:0;align-items:center;justify-content:center;}\n` +
      `body.standalone-legal .mobile-menu-toggle svg{width:20px;height:20px;}\n` +
      `body.standalone-legal .mobile-menu-toggle .menu-close-icon{display:none;}\n` +
      `body.standalone-legal .mobile-menu-toggle[aria-expanded="true"] .menu-open-icon{display:none;}\n` +
      `body.standalone-legal .mobile-menu-toggle[aria-expanded="true"] .menu-close-icon{display:block;}\n` +
      `body.standalone-legal .theme-toggle{width:40px;height:38px;padding:0;}\n` +
      `body.standalone-legal .theme-toggle svg{width:18px;height:18px;}\n` +
      `body.standalone-legal .theme-toggle .sun-icon{display:none;}\n` +
      `html[data-theme="light"] body.standalone-legal .theme-toggle .sun-icon{display:block;}\n` +
      `html[data-theme="light"] body.standalone-legal .theme-toggle .moon-icon{display:none;}\n` +
      `body.standalone-legal .theme-toggle-text{display:none;}\n` +
      `body.standalone-legal .site-footer{border-top:1px solid var(--rule);background:var(--bg-deep);padding:32px 28px calc(32px + env(safe-area-inset-bottom));color:var(--ink-faint);font-family:var(--font-body);}\n` +
      `body.standalone-legal .footer-inner{max-width:1180px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:18px 28px;flex-wrap:wrap;}\n` +
      `body.standalone-legal .footer-brand strong{color:var(--ink);font-family:var(--font-display);font-size:15px;}\n` +
      `body.standalone-legal .footer-links{display:flex;align-items:center;gap:8px 16px;flex-wrap:wrap;}\n` +
      `body.standalone-legal .footer-links a{color:var(--ink-faint)!important;text-decoration:none;font-size:12.5px;}\n` +
      `body.standalone-legal .footer-links a:hover,body.standalone-legal .footer-links a:focus-visible{color:var(--gold-soft)!important;}\n` +
      `body.standalone-legal .footer-copyright{display:flex;align-items:center;gap:7px;flex-wrap:wrap;color:var(--ink-faint);font-size:12px;}\n` +
      `body.standalone-legal main a{color:var(--gold-soft)!important;}\n` +
      `body.standalone-legal main .box{background:var(--panel)!important;border-color:var(--rule)!important;}\n` +
      `body.standalone-legal main .muted{color:var(--ink-faint)!important;}\n` +

      `@media(max-width:700px){\n` +
      `body.standalone-legal{--nav-h:64px;}\n` +
      `body.standalone-legal main{padding:calc(var(--nav-h) + 38px) 18px 78px!important;}\n` +
      `body.standalone-legal .topnav{padding:0 13px;box-shadow:0 6px 24px rgba(0,0,0,.12);}\n` +
      `body.standalone-legal .topnav .brand{gap:7px;font-size:17.5px;line-height:1;}\n` +
      `body.standalone-legal .topnav .brand-logo{width:35px;height:35px;}\n` +
      `body.standalone-legal .mobile-menu-toggle{display:inline-flex;width:44px;height:44px;border-radius:50%;background:var(--panel);}\n` +
      `body.standalone-legal .nav-actions{position:fixed;top:calc(var(--nav-h) + 8px);left:10px;right:10px;z-index:510;display:none;grid-template-columns:1fr;max-height:calc(100dvh - var(--nav-h) - 18px);overflow-y:auto;gap:4px;padding:9px 9px calc(9px + env(safe-area-inset-bottom));border:1px solid var(--rule);border-radius:19px;background:var(--panel);box-shadow:0 22px 70px rgba(0,0,0,.38);}\n` +
      `body.standalone-legal .nav-actions.open{display:grid;}\n` +
      `body.standalone-legal .nav-actions .nav-btn{width:100%;min-height:49px;padding:12px 14px;border-radius:12px;font-size:14px;}\n` +
      `body.standalone-legal .nav-actions .theme-toggle{width:100%;height:49px;}\n` +
      `body.standalone-legal .theme-toggle-text{display:inline;margin-left:7px;}\n` +
      `body.standalone-legal.nav-open{overflow:hidden;}\n` +
      `body.standalone-legal.nav-open::before{content:'';position:fixed;inset:var(--nav-h) 0 0;z-index:490;background:rgba(0,0,0,.44);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);}\n` +
      `}\n` +
      `@media(prefers-reduced-motion:reduce){.back-to-top{transition:none;}}\n` +
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
      `<nav class="topnav" aria-label="Primary navigation">` +
      `<a class="brand" href="/" aria-label="Mind Over Matter home"><img class="brand-logo" src="/brain-logo-v2.png" alt=""><span class="brand-title"><span class="mark">Mind</span> Over Matter</span></a>` +
      `<button class="nav-btn mobile-menu-toggle" id="legalMobileMenuToggle" type="button" aria-label="Open navigation menu" aria-expanded="false" aria-controls="legalNavActions">` +
      `<svg class="menu-open-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>` +
      `<svg class="menu-close-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>` +
      `<div class="nav-actions" id="legalNavActions">` +
      `<a class="nav-btn" href="/">Home</a><a class="nav-btn" href="/blog">Blog</a><a class="nav-btn" href="/books">Books</a><a class="nav-btn" href="/resources">Resources</a><a class="nav-btn" href="/about">About</a><a class="nav-btn" href="/account">Reader sign in</a>` +
      `<button class="nav-btn theme-toggle" id="legalThemeToggle" type="button" aria-label="Switch theme" title="Switch theme"><svg class="sun-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42"/></svg><svg class="moon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg><span class="theme-toggle-text">Theme</span></button>` +
      `</div></nav>` +
      `<script>(function(){var t=document.getElementById('legalMobileMenuToggle');var n=document.getElementById('legalNavActions');var theme=document.getElementById('legalThemeToggle');function close(){if(!t||!n)return;t.setAttribute('aria-expanded','false');n.classList.remove('open');document.body.classList.remove('nav-open');}if(t&&n){t.addEventListener('click',function(e){e.stopPropagation();var open=t.getAttribute('aria-expanded')==='true';t.setAttribute('aria-expanded',String(!open));n.classList.toggle('open',!open);document.body.classList.toggle('nav-open',!open);});n.querySelectorAll('a').forEach(function(a){a.addEventListener('click',close);});document.addEventListener('click',function(e){if(t.getAttribute('aria-expanded')==='true'&&!n.contains(e.target)&&!t.contains(e.target))close();});}if(theme){theme.addEventListener('click',function(){var next=document.documentElement.dataset.theme==='light'?'dark':'light';document.documentElement.dataset.theme=next;try{localStorage.setItem('mindovermatter_theme',next);}catch(e){}});}})();</script>`,
      { html: true }
    );

    element.after(
      `<footer class="site-footer">` +
      `<div class="footer-inner">` +
      `<div class="footer-brand"><strong>Mind Over Matter</strong></div>` +
      `<nav class="footer-links" aria-label="Footer navigation">` +
      `<a href="/">Home</a><a href="/blog">Blog</a><a href="/books">Books</a><a href="/resources">Resources</a><a href="/about">About</a><a href="/privacy">Privacy Policy</a><a href="/terms">Terms of Use</a><a href="/affiliate-disclosure">Affiliate Disclosure</a><a href="mailto:hello@stephenleynard.com">Contact</a>` +
      `</nav>` +
      `<div class="footer-copyright"><span>© 2026 Stephen Leynard</span><span aria-hidden="true">·</span><span>All rights reserved.</span></div>` +
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
  const privateShell = path === '/account' || path === '/admin';
  const standaloneLegalPage = path === '/privacy' || path === '/terms' || path === '/affiliate-disclosure';
  const routeMeta = SPA_PUBLIC_ROUTES[path];

  let rewriter = new HTMLRewriter()
    .on('head', new SharedChromeStyles())
    .on('body', new BackToTopControl());

  if (standaloneLegalPage) {
    rewriter = rewriter
      .on('body', new AddBodyClass('standalone-legal'))
      .on('main nav', new RemoveElement())
      .on('main footer', new RemoveElement())
      .on('main', new LegalSiteShell());
  }

  if (!privateShell && !standaloneLegalPage) {
    for (const selector of PRIVATE_SELECTORS) {
      rewriter = rewriter.on(selector, new RemoveElement());
    }
    rewriter = rewriter.on('body', new PrivateRouteGuard());
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
