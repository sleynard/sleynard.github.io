export async function onRequest({ request, env }) {
  const asset = await env.ASSETS.fetch(new URL('/', request.url));
  let html = await asset.text();
  html = html
    .replace(/<title>[\s\S]*?<\/title>/i, '<title>Reader Account | Mind Over Matter</title>')
    .replace(
      /<meta name="robots" content="[^"]*">/i,
      '<meta name="robots" content="noindex,nofollow">'
    )
    .replace(
      /<link rel="canonical" href="[^"]*">/i,
      '<link rel="canonical" href="https://stephenleynard.com/account">'
    );
  return new Response(html, {
    headers: {
      'content-type': 'text/html; charset=UTF-8',
      'cache-control': 'private, no-store',
      'x-robots-tag': 'noindex, nofollow',
      'x-content-type-options': 'nosniff',
      'x-frame-options': 'DENY',
      'referrer-policy': 'strict-origin-when-cross-origin',
      'permissions-policy': 'camera=(), microphone=(), geolocation=()',
      'strict-transport-security': 'max-age=31536000; includeSubDomains',
      'content-security-policy': "default-src 'self'; connect-src 'self' https://ljseqpciuohncchdcewa.supabase.co https://cloudflareinsights.com; img-src 'self' https: data:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com; base-uri 'self'; form-action 'self'; frame-ancestors 'none'"
    }
  });
}
