/**
 * REWIRE CONSULTING — Cloudflare Worker
 * Receives contact form submissions and sends email via Email Routing
 *
 * Deploy this separately — do NOT put this in your GitHub website repo.
 * Follow the setup instructions to deploy via Cloudflare dashboard.
 */

export default {
  async fetch(request, env) {

    // Allow CORS from your domain
    const corsHeaders = {
      'Access-Control-Allow-Origin': 'https://www.rewiretransform.com',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      const data = await request.json();
      const { name, company, email, challenge, message } = data;

      // Basic validation
      if (!name || !email || !message) {
        return new Response(JSON.stringify({ error: 'Missing required fields' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Build the email body
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

      // Send via Cloudflare Email Routing
      await env.EMAIL.send({
        from: 'noreply@rewiretransform.com',
        to:   'info@rewiretransform.com',
        subject: `New Enquiry: ${name} — ${challenge || 'General'}`,
        text: emailBody,
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
};
