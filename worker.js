/**
 * REWIRE CONSULTING — Cloudflare Worker
 * Handles: contact form + Ticketmaster API proxy for JCQ Suite Reservations
 */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // ── TICKETMASTER PROXY ─────────────────────────────────────────────────
    if (url.pathname.startsWith('/tm-api/')) {
      // Strip /tm-api prefix and forward to Ticketmaster
      const tmPath = url.pathname.replace('/tm-api', '');
      const tmUrl  = `https://app.ticketmaster.com${tmPath}${url.search}`;

      const tmResponse = await fetch(tmUrl, {
        method:  request.method,
        headers: { 'Accept': 'application/json' },
      });

      const data = await tmResponse.text();

      return new Response(data, {
        status: tmResponse.status,
        headers: {
          'Content-Type':                'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control':               'public, max-age=300', // cache 5 min
        },
      });
    }

    // ── CORS PREFLIGHT ─────────────────────────────────────────────────────
    const corsHeaders = {
      'Access-Control-Allow-Origin':  '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // ── CONTACT FORM ───────────────────────────────────────────────────────
    if (url.pathname === '/contact' || url.pathname === '/api/contact') {
      if (request.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 });
      }

      try {
        const data = await request.json();
        const { name, company, email, challenge, message } = data;

        if (!name || !email || !message) {
          return new Response(JSON.stringify({ error: 'Missing required fields' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const emailBody = `
New enquiry from rewiretransform.com
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NAME:      ${name}
COMPANY:   ${company || '—'}
EMAIL:     ${email}
CHALLENGE: ${challenge || '—'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MESSAGE:
${message}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Sent from rewiretransform.com contact form
        `.trim();

        await env.EMAIL.send({
          from:    'noreply@rewiretransform.com',
          to:      'info@rewiretransform.com',
          subject: `New Enquiry: ${name} — ${challenge || 'General'}`,
          text:    emailBody,
        });

        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      } catch (err) {
        return new Response(JSON.stringify({ error: 'Server error' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // ── ALL OTHER REQUESTS — pass through to Pages ─────────────────────────
    return fetch(request);
  }
};
