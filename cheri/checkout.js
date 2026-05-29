// functions/api/checkout.js
// Cloudflare Pages Function — creates a Stripe Checkout Session.
// Deploys automatically when placed at /functions/api/checkout.js in your repo.
// Set STRIPE_SECRET_KEY in Cloudflare Pages → Settings → Environment variables.

export async function onRequestPost(context) {
  const { request, env } = context;

  // CORS / preflight safety
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  try {
    const { items } = await request.json();
    if (!items || !items.length) {
      return json({ error: "Cart is empty" }, 400, cors);
    }

    // Build Stripe line_items. Two modes supported:
    //  1) If the product has a Stripe priceId (price_xxx), use it directly.
    //  2) Otherwise create an inline price from name + amount (USD).
    const params = new URLSearchParams();
    params.append("mode", "payment");
    params.append("success_url", `${new URL(request.url).origin}/?paid=1`);
    params.append("cancel_url", `${new URL(request.url).origin}/?canceled=1`);

    // Collect shipping/pickup info
    params.append("phone_number_collection[enabled]", "true");
    params.append("billing_address_collection", "auto");

    items.forEach((item, i) => {
      params.append(`line_items[${i}][quantity]`, String(item.qty || 1));
      if (item.priceId) {
        params.append(`line_items[${i}][price]`, item.priceId);
      } else {
        params.append(`line_items[${i}][price_data][currency]`, "usd");
        params.append(`line_items[${i}][price_data][unit_amount]`, String(Math.round(item.price * 100)));
        params.append(`line_items[${i}][price_data][product_data][name]`, item.name);
      }
    });

    const resp = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });

    const session = await resp.json();
    if (!resp.ok) {
      return json({ error: session.error?.message || "Stripe error" }, 500, cors);
    }
    return json({ url: session.url }, 200, cors);
  } catch (err) {
    return json({ error: String(err) }, 500, cors);
  }
}

// Handle CORS preflight
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

function json(obj, status, cors) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", ...cors },
  });
}
