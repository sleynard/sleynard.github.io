const SUPABASE_URL = 'https://ljseqpciuohncchdcewa.supabase.co';
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function page(title, message, showForm = false, token = '') {
  const form = showForm
    ? `<form method="post" action="/unsubscribe?token=${encodeURIComponent(token)}"><button type="submit">Unsubscribe</button></form>`
    : '<a href="/">Return to Mind Over Matter</a>';
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${title} | Mind Over Matter</title><style>color-scheme:dark light;body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0c0b09;color:#efe9d8;font-family:Arial,sans-serif}.card{width:min(520px,calc(100% - 40px));box-sizing:border-box;padding:42px;border:1px solid #2a2619;border-radius:12px;background:#17150f;text-align:center}h1{font-family:Georgia,serif;font-size:34px}p{color:#b3aa95;line-height:1.7}button,a{display:inline-block;margin-top:12px;padding:13px 20px;border:0;border-radius:6px;background:#b89b4a;color:#0c0b09;font-weight:700;text-decoration:none;cursor:pointer}</style></head><body><main class="card"><p>Mind Over Matter</p><h1>${title}</h1><p>${message}</p>${form}</main></body></html>`;
}

function response(html, status = 200) {
  return new Response(html, {
    status,
    headers: {
      'content-type': 'text/html; charset=UTF-8',
      'cache-control': 'no-store',
      'content-security-policy': "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'",
      'x-content-type-options': 'nosniff',
      'x-frame-options': 'DENY'
    }
  });
}

export async function onRequest({ request, env }) {
  if (!['GET', 'POST'].includes(request.method)) return response('Method not allowed', 405);
  const token = new URL(request.url).searchParams.get('token') || '';
  if (!UUID_PATTERN.test(token)) {
    return response(page('Link unavailable', 'This unsubscribe link is incomplete or invalid.'), 400);
  }
  if (request.method === 'GET') {
    return response(page('Email preferences', 'Select unsubscribe to stop all essay and book-recommendation emails. You can opt in again from your reader account.', true, token));
  }
  const secretKey = env.SUPABASE_SECRET_KEY || env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secretKey) {
    return response(page('Please try again', 'The preference service is temporarily unavailable.'), 503);
  }

  const headers = {
    apikey: secretKey,
    'Content-Type': 'application/json',
    Prefer: 'return=minimal'
  };
  if (!secretKey.startsWith('sb_secret_')) headers.Authorization = `Bearer ${secretKey}`;
  const result = await fetch(`${SUPABASE_URL}/rest/v1/newsletter_subscriptions?unsubscribe_token=eq.${encodeURIComponent(token)}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ subscribed: false })
  });
  if (!result.ok) return response(page('Please try again', 'Your request could not be completed. You can also change this preference in your reader account.'), 502);
  return response(page('You are unsubscribed', 'You will no longer receive publication emails. Your reader account and on-site activity are unchanged.'));
}
