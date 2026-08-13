const SUPABASE_REST_URL = 'https://ljseqpciuohncchdcewa.supabase.co/rest/v1/';
const SUPABASE_KEY = 'sb_publishable_cWKtBkdbEFnbtJYV0Ttt0w_rn42Hx-k';
const SITE_URL = 'https://stephenleynard.com';

function xml(value = '') {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
}

function summary(value = '') {
  const text = String(value).replace(/\s+/g, ' ').trim();
  return text.length > 240 ? `${text.slice(0, 237).trim()}…` : text;
}

export async function onRequest() {
  const response = await fetch(`${SUPABASE_REST_URL}posts?select=title,body,summary,slug,created_at&published=eq.true&order=created_at.desc&limit=50`, { headers: { apikey: SUPABASE_KEY } });
  const posts = response.ok ? await response.json() : [];
  const items = posts.map(post => {
    const link = `${SITE_URL}/blog/${post.slug}`;
    return `<item><title>${xml(post.title)}</title><link>${xml(link)}</link><guid>${xml(link)}</guid><pubDate>${new Date(post.created_at).toUTCString()}</pubDate><description>${xml(post.summary || summary(post.body))}</description></item>`;
  }).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Mind Over Matter</title><link>${SITE_URL}</link><description>Essays on psychology and behavior by Stephen Leynard.</description>${items}</channel></rss>`, { headers: { 'content-type': 'application/rss+xml; charset=UTF-8', 'cache-control': 'public, max-age=300' } });
}
