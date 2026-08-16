const SITE_URL = 'https://stephenleynard.com';

const PUBLIC_ROUTES = {
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
  },
  '/privacy': {
    title: 'Privacy Policy | Mind Over Matter',
    description: 'Read the privacy policy for Mind Over Matter and stephenleynard.com.'
  },
  '/terms': {
    title: 'Terms of Use | Mind Over Matter',
    description: 'Read the terms governing use of Mind Over Matter and stephenleynard.com.'
  },
  '/affiliate-disclosure': {
    title: 'Affiliate Disclosure | Mind Over Matter',
    description: 'Read the affiliate disclosure for Mind Over Matter and learn how affiliate links and material connections are handled.'
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

const DUPLICATE_LEGAL_SELECTORS = [
  '#view-privacy',
  '#view-affiliate-disclosure'
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

class CanonicalLegalLink {
  constructor(label) {
    this.label = label;
  }
  element(element) {
    element.removeAttribute('onclick');
    if (this.label) element.setInnerContent(this.label);
  }
}

class AddTermsAfterPrivacy {
  element(element) {
    element.after('<a href="/terms">Terms of Use</a>', { html: true });
  }
}

class AddSignupLegalNotice {
  element(element) {
    element.append(
      '<p style="margin:12px 0 0;color:var(--ink-faint);font-size:11.5px;line-height:1.6">By creating a reader account, you agree to the <a href="/terms" style="color:var(--gold-soft);text-decoration:underline">Terms of Use</a> and acknowledge the <a href="/privacy" style="color:var(--gold-soft);text-decoration:underline">Privacy Policy</a>. Publication emails remain optional.</p>',
      { html: true }
    );
  }
}

class NavigationGuard {
  constructor(includePrivateRedirects) {
    this.includePrivateRedirects = includePrivateRedirects;
  }
  element(element) {
    const privateRedirects = this.includePrivateRedirects
      ? `var account=window.goReaderAccount;if(typeof account==='function'){window.goReaderAccount=function(){if(!document.getElementById('view-account')){location.assign('/account');return;}return account.apply(this,arguments);};}\n` +
        `var admin=window.goAdminEntry;if(typeof admin==='function'){window.goAdminEntry=function(){if(!document.getElementById('view-login')){location.assign('/admin');return;}return admin.apply(this,arguments);};}\n`
      : '';

    element.append(
      `<script>(function(){\n` +
      privateRedirects +
      `window.goPrivacy=function(){location.assign('/privacy');};\n` +
      `window.goAffiliateDisclosure=function(){location.assign('/affiliate-disclosure');};\n` +
      `document.addEventListener('click',function(event){var link=event.target.closest&&event.target.closest('a[href="/privacy"],a[href="/terms"],a[href="/affiliate-disclosure"]');if(!link)return;event.preventDefault();event.stopImmediatePropagation();location.assign(link.getAttribute('href'));},true);\n` +
      `})();</script>`,
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
  const routeMeta = PUBLIC_ROUTES[path];

  let rewriter = new HTMLRewriter();

  if (!standaloneLegalPage) {
    for (const selector of DUPLICATE_LEGAL_SELECTORS) {
      rewriter = rewriter.on(selector, new RemoveElement());
    }

    rewriter = rewriter
      .on('.footer-links a[href="/privacy"]', new CanonicalLegalLink('Privacy Policy'))
      .on('.footer-links a[href="/privacy"]', new AddTermsAfterPrivacy())
      .on('.footer-links a[href="/affiliate-disclosure"]', new CanonicalLegalLink('Affiliate Disclosure'))
      .on('body', new NavigationGuard(!privateShell));
  }

  if (path === '/account') {
    rewriter = rewriter.on('#readerNewsletterSignup', new AddSignupLegalNotice());
  }

  if (!privateShell && !standaloneLegalPage) {
    for (const selector of PRIVATE_SELECTORS) {
      rewriter = rewriter.on(selector, new RemoveElement());
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
