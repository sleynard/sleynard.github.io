const SUPABASE_URL = 'https://ljseqpciuohncchdcewa.supabase.co';
const SUPABASE_KEY = 'sb_publishable_cWKtBkdbEFnbtJYV0Ttt0w_rn42Hx-k';
const OWNER_USER_ID = 'e21f3af3-0afb-41e4-a84f-5b8f10d7f37b';
const DEFAULT_SITE_URL = 'https://stephenleynard.com';

const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: {
    'content-type': 'application/json; charset=UTF-8',
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff'
  }
});

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function excerpt(value = '', length = 210) {
  const text = String(value).replace(/\s+/g, ' ').trim();
  return text.length > length ? `${text.slice(0, length - 1).trim()}…` : text;
}

function chunks(list, size) {
  return Array.from({ length: Math.ceil(list.length / size) }, (_, index) =>
    list.slice(index * size, index * size + size)
  );
}

async function supabase(env, path, options = {}) {
  const secretKey = env.SUPABASE_SECRET_KEY || env.SUPABASE_SERVICE_ROLE_KEY;
  const headers = {
    apikey: secretKey,
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };
  if (!secretKey.startsWith('sb_secret_')) headers.Authorization = `Bearer ${secretKey}`;
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, { ...options, headers });
  const raw = await response.text();
  let body = null;
  try { body = raw ? JSON.parse(raw) : null; } catch { body = raw; }
  if (!response.ok) throw new Error(body?.message || body?.details || raw || `Supabase error ${response.status}`);
  return body;
}

async function verifyOwner(request) {
  const authorization = request.headers.get('authorization') || '';
  if (!authorization.startsWith('Bearer ')) return false;
  const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: SUPABASE_KEY, Authorization: authorization }
  });
  if (!response.ok) return false;
  const user = await response.json();
  return user?.id === OWNER_USER_ID;
}

async function loadSubscribers(env, topic) {
  const rows = [];
  for (let start = 0; ; start += 1000) {
    const page = await supabase(
      env,
      `newsletter_subscriptions?select=email,unsubscribe_token&subscribed=eq.true&${topic}=eq.true&order=created_at.asc`,
      { headers: { Range: `${start}-${start + 999}` } }
    );
    rows.push(...page);
    if (page.length < 1000) break;
  }
  return rows;
}

function emailFor({ type, item, subscriber, siteUrl, mailingAddress, fromName }) {
  const isEssay = type === 'essay';
  const contentLabel = isEssay ? 'essay' : 'book recommendation';
  const target = isEssay
    ? `${siteUrl}/blog/${encodeURIComponent(item.slug)}`
    : `${siteUrl}/books`;
  const summary = excerpt(isEssay ? (item.summary || item.body) : item.description);
  const unsubscribe = `${siteUrl}/unsubscribe?token=${encodeURIComponent(subscriber.unsubscribe_token)}`;
  const subject = `New ${contentLabel}: ${item.title}`;
  const safeTitle = escapeHtml(item.title);
  const safeSummary = escapeHtml(summary);
  const safeAddress = escapeHtml(mailingAddress);

  return {
    to: [subscriber.email],
    subject,
    headers: {
      'List-Unsubscribe': `<${unsubscribe}>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click'
    },
    html: `<!doctype html><html><body style="margin:0;background:#0c0b09;color:#efe9d8;font-family:Arial,sans-serif"><div style="max-width:620px;margin:0 auto;padding:42px 22px"><p style="margin:0 0 18px;color:#b89b4a;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase">Mind Over Matter</p><h1 style="margin:0 0 16px;font-family:Georgia,serif;font-size:34px;line-height:1.15">${safeTitle}</h1><p style="margin:0 0 26px;color:#c9c0ad;font-size:16px;line-height:1.7">${safeSummary}</p><p><a href="${target}" style="display:inline-block;padding:13px 20px;border-radius:6px;background:#b89b4a;color:#0c0b09;font-weight:700;text-decoration:none">Read the ${contentLabel}</a></p><hr style="margin:36px 0 20px;border:0;border-top:1px solid #2a2619"><p style="color:#8e8572;font-size:12px;line-height:1.7">You received this because you opted in to Mind Over Matter publication updates. ${escapeHtml(fromName)}, ${safeAddress}. <a href="${unsubscribe}" style="color:#c9ae64">Unsubscribe or change your preferences</a>.</p></div></body></html>`,
    text: `Mind Over Matter\n\n${item.title}\n\n${summary}\n\nRead the ${contentLabel}: ${target}\n\nYou received this because you opted in to Mind Over Matter publication updates. ${fromName}, ${mailingAddress}. Unsubscribe: ${unsubscribe}`
  };
}

export async function onRequest({ request, env }) {
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  if (!(await verifyOwner(request))) return json({ error: 'Not authorized' }, 403);

  const required = ['RESEND_API_KEY', 'NEWSLETTER_FROM', 'NEWSLETTER_MAILING_ADDRESS'];
  const missing = required.filter(name => !env[name]);
  if (!env.SUPABASE_SECRET_KEY && !env.SUPABASE_SERVICE_ROLE_KEY) missing.unshift('SUPABASE_SECRET_KEY');
  if (missing.length) return json({ error: 'Newsletter setup is incomplete', missing }, 503);

  let input;
  try { input = await request.json(); } catch { return json({ error: 'Invalid request' }, 400); }
  const type = input?.content_type;
  const id = Number(input?.id);
  if (!['essay', 'book'].includes(type) || !Number.isSafeInteger(id) || id < 1) {
    return json({ error: 'Invalid content' }, 400);
  }

  const table = type === 'essay' ? 'posts' : 'books';
  const select = type === 'essay'
    ? 'id,title,slug,summary,body,published,publish_at'
    : 'id,title,author,description,published';
  const [item] = await supabase(env, `${table}?select=${select}&id=eq.${id}&limit=1`);
  if (!item || !item.published || (type === 'essay' && item.publish_at && new Date(item.publish_at) > new Date())) {
    return json({ error: 'Content is not publicly published' }, 409);
  }

  const existing = await supabase(env, `newsletter_deliveries?select=id,status&content_type=eq.${type}&content_id=eq.${id}&limit=1`);
  if (existing[0]?.status === 'sent' || existing[0]?.status === 'sending') {
    return json({ ok: true, duplicate: true, sent: 0 });
  }

  let deliveryId = existing[0]?.id;
  if (deliveryId) {
    await supabase(env, `newsletter_deliveries?id=eq.${deliveryId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'sending', error_message: null })
    });
  } else {
    const created = await supabase(env, 'newsletter_deliveries', {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify({ content_type: type, content_id: id, status: 'sending' })
    });
    deliveryId = created[0].id;
  }

  const siteUrl = String(env.SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, '');
  const fromName = env.NEWSLETTER_SENDER_NAME || 'Stephen Leynard';
  const subscribers = await loadSubscribers(env, type === 'essay' ? 'essays' : 'books');
  const subject = `New ${type === 'essay' ? 'essay' : 'book recommendation'}: ${item.title}`;
  const providerIds = [];

  try {
    for (const group of chunks(subscribers, 100)) {
      if (!group.length) continue;
      const emails = group.map(subscriber => ({
        from: env.NEWSLETTER_FROM,
        reply_to: env.NEWSLETTER_REPLY_TO || 'hello@stephenleynard.com',
        ...emailFor({ type, item, subscriber, siteUrl, mailingAddress: env.NEWSLETTER_MAILING_ADDRESS, fromName })
      }));
      const response = await fetch('https://api.resend.com/emails/batch', {
        method: 'POST',
        headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(emails)
      });
      const raw = await response.text();
      let result = null;
      try { result = raw ? JSON.parse(raw) : null; } catch { result = raw; }
      if (!response.ok) throw new Error(result?.message || raw || `Resend error ${response.status}`);
      providerIds.push(result);
    }

    await supabase(env, `newsletter_deliveries?id=eq.${deliveryId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        status: 'sent',
        subject,
        recipient_count: subscribers.length,
        provider_ids: providerIds,
        sent_at: new Date().toISOString(),
        error_message: null
      })
    });
    return json({ ok: true, sent: subscribers.length });
  } catch (error) {
    await supabase(env, `newsletter_deliveries?id=eq.${deliveryId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'failed', error_message: String(error.message || error).slice(0, 500) })
    }).catch(() => {});
    return json({ error: 'Email delivery failed' }, 502);
  }
}
