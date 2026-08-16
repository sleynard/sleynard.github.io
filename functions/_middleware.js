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
    title: 'Privacy | Mind Over Matter',
    description: 'Read the privacy information for Mind Over Matter and stephenleynard.com.'
  },
  '/affiliate-disclosure': {
    title: 'Affiliate Disclosure | Mind Over Matter',
    description: 'Read the affiliate disclosure for Mind Over Matter and learn how affiliate links are handled.'
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

class RedirectPrivateNavigation {
  element(element) {
    element.append(
      `<script>(function(){\n` +
      `var account=window.goReaderAccount;window.goReaderAccount=function(){if(!document.getElementById('view-account')){location.href='/account';return;}return account.apply(this,arguments);};\n` +
      `var admin=window.goAdminEntry;window.goAdminEntry=function(){if(!document.getElementById('view-login')){location.href='/admin';return;}return admin.apply(this,arguments);};\n` +
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
  const routeMeta = PUBLIC_ROUTES[path];

  let rewriter = new HTMLRewriter();

  if (!privateShell) {
    for (const selector of PRIVATE_SELECTORS) {
      rewriter = rewriter.on(selector, new RemoveElement());
    }
    rewriter = rewriter.on('body', new RedirectPrivateNavigation());
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
