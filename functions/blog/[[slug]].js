const SUPABASE_REST_URL = 'https://ljseqpciuohncchdcewa.supabase.co/rest/v1/';
const SUPABASE_KEY = 'sb_publishable_cWKtBkdbEFnbtJYV0Ttt0w_rn42Hx-k';
const SITE_URL = 'https://stephenleynard.com';

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function excerpt(value = '') {
  const text = String(value).replace(/\s+/g, ' ').trim();
  return text.length > 190 ? `${text.slice(0, 187).trim()}…` : text;
}

export async function onRequest(context) {
  const slugParts = Array.isArray(context.params.slug)
    ? context.params.slug
    : [context.params.slug].filter(Boolean);
  if (slugParts.length !== 1) return context.next();
  const [slug] = slugParts;

  const postResponse = await fetch(
    `${SUPABASE_REST_URL}posts?select=id,title,body,summary,slug,category,cover_image_url,created_at,updated_at&slug=eq.${encodeURIComponent(slug)}&published=eq.true&limit=1`,
    { headers: { apikey: SUPABASE_KEY } }
  );
  if (!postResponse.ok) return context.next();
  const [post] = await postResponse.json();
  if (!post) return new Response('Article not found', { status: 404 });

  const assetResponse = await context.env.ASSETS.fetch(new URL('/', context.request.url));
  let html = await assetResponse.text();
  const title = `${post.title} — Mind Over Matter`;
  const description = post.summary || excerpt(post.body);
  const url = `${SITE_URL}/blog/${encodeURIComponent(post.slug)}`;
  const image = post.cover_image_url || `${SITE_URL}/brain-share-v3.png`;
  const wordCount = String(post.body || '').trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(wordCount / 220));
  const metadata = `<!-- ARTICLE_META_START -->
<meta name="description" content="${escapeHtml(description)}">
<meta name="author" content="Stephen Leynard">
<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
<meta property="og:type" content="article">
<meta property="og:site_name" content="Mind Over Matter">
<meta property="og:locale" content="en_CA">
<meta property="og:title" content="${escapeHtml(title)}">
<meta property="og:description" content="${escapeHtml(description)}">
<meta property="og:url" content="${escapeHtml(url)}">
<meta property="og:image" content="${escapeHtml(image)}">
<meta property="og:image:alt" content="${escapeHtml(post.title)}">
<meta property="article:published_time" content="${escapeHtml(post.created_at)}">
<meta property="article:modified_time" content="${escapeHtml(post.updated_at)}">
<meta property="article:author" content="Stephen Leynard">
<meta property="article:section" content="${escapeHtml(post.category || 'Psychology')}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHtml(title)}">
<meta name="twitter:description" content="${escapeHtml(description)}">
<meta name="twitter:image" content="${escapeHtml(image)}">
<meta name="twitter:image:alt" content="${escapeHtml(post.title)}">
<link rel="canonical" href="${escapeHtml(url)}">
<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description,
    image: [image],
    datePublished: post.created_at,
    dateModified: post.updated_at,
    articleSection: post.category || 'Psychology',
    wordCount,
    timeRequired: `PT${minutes}M`,
    inLanguage: 'en-CA',
    isAccessibleForFree: true,
    author: { '@type': 'Person', '@id': `${SITE_URL}/#stephen-leynard`, name: 'Stephen Leynard', url: `${SITE_URL}/about` },
    publisher: { '@type': 'Organization', name: 'Mind Over Matter', logo: { '@type': 'ImageObject', url: `${SITE_URL}/brain-logo-v2.png` } },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url }
  }).replaceAll('<', '\\u003c')}</script>
<!-- ARTICLE_META_END -->`;

  html = html
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`)
    .replace(/<!-- ARTICLE_META_START -->[\s\S]*?<!-- ARTICLE_META_END -->/, metadata);

  return new Response(html, {
    headers: {
      'content-type': 'text/html; charset=UTF-8',
      'cache-control': 'public, max-age=60, s-maxage=300',
      'x-content-type-options': 'nosniff',
      'x-frame-options': 'DENY',
      'referrer-policy': 'strict-origin-when-cross-origin',
      'permissions-policy': 'camera=(), microphone=(), geolocation=()',
      'strict-transport-security': 'max-age=31536000; includeSubDomains',
      'cross-origin-opener-policy': 'same-origin',
      'content-security-policy': "default-src 'self'; connect-src 'self' https://ljseqpciuohncchdcewa.supabase.co https://cloudflareinsights.com; img-src 'self' https: data:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com; base-uri 'self'; form-action 'self'; frame-ancestors 'none'"
    }
  });
}
