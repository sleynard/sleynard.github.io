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
      `.back-to-top{position:fixed;right:18px;bottom:calc(18px + env(safe-area-inset-bottom));z-index:460;width:42px;height:42px;display:grid;place-items:center;border:1px solid var(--border,rgba(170,162,147,.35));border-radius:50%;background:var(--panel-glass,rgba(21,19,15,.88));color:var(--ink,#eee8dc);box-shadow:0 8px 26px rgba(0,0,0,.16);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);opacity:0;visibility:hidden;pointer-events:none;transform:translateY(8px);transition:opacity .2s ease,transform .2s ease,visibility .2s ease,border-color .2s ease,background .2s ease;cursor:pointer;}\n` +
      `.back-to-top.is-visible{opacity:.78;visibility:visible;pointer-events:auto;transform:translateY(0);}\n` +
      `.back-to-top:hover,.back-to-top:focus-visible{opacity:1;border-color:var(--gold,#d7bd70);outline:none;}\n` +
      `.back-to-top svg{width:18px;height:18px;display:block;}\n` +
      `.legal-site-header{position:sticky;top:0;z-index:440;border-bottom:1px solid rgba(170,162,147,.22);background:rgba(12,11,9,.92);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);}\n` +
      `.legal-site-header-inner{max-width:1120px;margin:0 auto;min-height:68px;padding:0 24px;display:flex;align-items:center;justify-content:space-between;gap:24px;}\n` +
      `.legal-site-brand{display:inline-flex;align-items:center;gap:9px;color:#eee8dc!important;text-decoration:none;font-family:Georgia,serif;font-weight:700;font-size:18px;white-space:nowrap;}\n` +
      `.legal-site-brand img{width:34px;height:34px;display:block;}\n` +
      `.legal-site-brand strong{color:#d7bd70;font-weight:700;}\n` +
      `.legal-site-nav{display:flex;align-items:center;justify-content:flex-end;gap:6px 18px;flex-wrap:wrap;font-size:13px;}\n` +
      `.legal-site-nav a{color:#c9c2b5!important;text-decoration:none;white-space:nowrap;}\n` +
      `.legal-site-nav a:hover,.legal-site-nav a:focus-visible{color:#d7bd70!important;text-decoration:underline;text-underline-offset:4px;}\n` +
      `.legal-site-footer{border-top:1px solid rgba(170,162,147,.22);background:rgba(8,7,6,.38);padding:30px 24px calc(32px + env(safe-area-inset-bottom));color:#aaa293;font-size:13px;}\n` +
      `.legal-site-footer-inner{max-width:1120px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:18px 28px;flex-wrap:wrap;}\n` +
      `.legal-site-footer strong{color:#eee8dc;font-family:Georgia,serif;}\n` +
      `.legal-site-footer nav{display:flex;gap:8px 16px;flex-wrap:wrap;margin:0;}\n` +
      `.legal-site-footer a{color:#aaa293!important;text-decoration:none;}\n` +
      `.legal-site-footer a:hover,.legal-site-footer a:focus-visible{color:#d7bd70!important;text-decoration:underline;text-underline-offset:3px;}\n` +
      `@media(max-width:760px){.back-to-top{right:13px;bottom:calc(13px + env(safe-area-inset-bottom));width:40px;height:40px}.legal-site-header-inner{min-height:64px;padding:10px 16px;align-items:flex-start;flex-direction:column;gap:8px}.legal-site-nav{width:100%;justify-content:flex-start;gap:4px 15px;padding-bottom:4px}.legal-site-footer{padding-left:18px;padding-right:18px}.legal-site-footer-inner{align-items:flex-start;flex-direction:column}.legal-site-footer nav{gap:5px 14px}}\n` +
      `@media(prefers-color-scheme:light){.legal-site-header{background:rgba(251,248,240,.94);border-color:rgba(78,70,57,.18)}.legal-site-brand{color:#211e18!important}.legal-site-nav a{color:#5e574c!important}.legal-site-footer{background:#f5efe3;border-color:#d8cfbe;color:#6c6559}.legal-site-footer strong{color:#211e18}.legal-site-footer a{color:#6c6559!important}.back-to-top{background:rgba(251,248,240,.9);color:#211e18;border-color:rgba(78,70,57,.22);box-shadow:0 8px 26px rgba(74,63,44,.12)}}\n` +
      `@media(prefers-reduced-motion:reduce){.back-to-top{transition:none;}}\n` +
      `</style>`,
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
      `<header class="legal-site-header">` +
      `<div class="legal-site-header-inner">` +
      `<a class="legal-site-brand" href="/"><img src="/brain-logo-v2.png" alt=""><span><strong>Mind</strong> Over Matter</span></a>` +
      `<nav class="legal-site-nav" aria-label="Site navigation">` +
      `<a href="/">Home</a><a href="/blog">Blog</a><a href="/books">Books</a><a href="/resources">Resources</a><a href="/about">About</a><a href="/account">Reader sign in</a>` +
      `</nav></div></header>`,
      { html: true }
    );

    element.after(
      `<footer class="legal-site-footer"><div class="legal-site-footer-inner">` +
      `<div><strong>Mind Over Matter</strong> · © 2026 Stephen Leynard · All rights reserved.</div>` +
      `<nav aria-label="Legal footer navigation">` +
      `<a href="/">Home</a><a href="/blog">Blog</a><a href="/books">Books</a><a href="/resources">Resources</a><a href="/about">About</a><a href="/privacy">Privacy Policy</a><a href="/terms">Terms of Use</a><a href="/affiliate-disclosure">Affiliate Disclosure</a><a href="mailto:hello@stephenleynard.com">Contact</a>` +
      `</nav></div></footer>`,
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
