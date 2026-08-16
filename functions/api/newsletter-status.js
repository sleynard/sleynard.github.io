export async function onRequest({ env }) {
  const mailingAddress = String(env.NEWSLETTER_PUBLIC_MAILING_ADDRESS || '').trim();
  const senderName = String(env.NEWSLETTER_SENDER_NAME || 'Stephen Leynard').trim();
  const contactEmail = String(env.NEWSLETTER_REPLY_TO || 'hello@stephenleynard.com').trim();
  const configured = Boolean(
    mailingAddress &&
    env.NEWSLETTER_FROM &&
    env.RESEND_API_KEY &&
    (env.SUPABASE_SECRET_KEY || env.SUPABASE_SERVICE_ROLE_KEY)
  );

  return new Response(JSON.stringify({
    configured,
    senderName,
    contactEmail,
    mailingAddress: configured ? mailingAddress : ''
  }), {
    headers: {
      'content-type': 'application/json; charset=UTF-8',
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff'
    }
  });
}
