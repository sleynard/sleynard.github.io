const SUPABASE_REST_URL = 'https://ljseqpciuohncchdcewa.supabase.co/rest/v1/';
const SUPABASE_KEY = 'sb_publishable_cWKtBkdbEFnbtJYV0Ttt0w_rn42Hx-k';
const SITE_URL = 'https://stephenleynard.com';

function xml(value = '') {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
}

export async function onRequest() {
  const response = await fetch(
    `${SUPABASE_REST_URL}posts?select=slug,updated_at,publish_at&published=eq.true&order=created_at.desc`,
    { headers: { apikey: SUPABASE_KEY } }
  );
  const now = Date.now();
  const posts = response.ok
    ? (await response.json()).filter(post => !post.publish_at || new Date(post.publish_at).getTime() <= now)
    : [];

  const urls = [
    `<url><loc>${SITE_URL}/</loc></url>`,
    `<url><loc>${SITE_URL}/blog</loc></url>`,
    `<url><loc>${SITE_URL}/books</loc></url>`,
    `<url><loc>${SITE_URL}/resources</loc></url>`,
    `<url><loc>${SITE_URL}/about</loc></url>`,
    `<url><loc>${SITE_URL}/privacy</loc></url>`,
    `<url><loc>${SITE_URL}/terms</loc></url>`,
    `<url><loc>${SITE_URL}/affiliate-disclosure</loc></url>`,
    ...posts.map(post => `<url><loc>${xml(`${SITE_URL}/blog/${post.slug}`)}</loc><lastmod>${xml(post.updated_at)}</lastmod></url>`)
  ].join('');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`,
    { headers: { 'content-type': 'application/xml; charset=UTF-8', 'cache-control': 'public, max-age=300' } }
  );
}
