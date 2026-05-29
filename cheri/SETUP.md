# Chéri Alfajores — Store Setup Guide

Your storefront is a static site (`index.html`) plus one small Cloudflare
serverless function (`functions/api/checkout.js`) that handles secure card
payments through Stripe. Everything runs on Cloudflare Pages' free tier — the
same setup as Rewire.

---

## File structure

Put these in your repo exactly like this:

```
/
├── index.html                  ← the storefront
└── functions/
    └── api/
        └── checkout.js         ← Stripe Checkout function (auto-deployed)
```

Cloudflare Pages automatically turns anything under `/functions/` into a
serverless API route. `functions/api/checkout.js` becomes `https://yoursite.com/api/checkout`.

---

## How checkout works

1. Customer adds items → clicks **Checkout Securely**.
2. The page POSTs the cart to `/api/checkout`.
3. The function creates a Stripe Checkout Session and returns its URL.
4. Customer is redirected to Stripe's hosted, secure payment page.
5. After paying, they return to your site (`/?paid=1`).

**Until you add a Stripe key, checkout safely falls back to opening your
Instagram DMs** — so the site is fully usable today.

---

## Connect Stripe (≈10 minutes, free)

1. Create a free account at https://stripe.com
2. In the Stripe Dashboard, go to **Developers → API keys** and copy your
   **Secret key** (starts with `sk_live_...`, or `sk_test_...` for testing).
3. In Cloudflare: **Pages → your project → Settings → Environment variables**.
4. Add a variable:
   - Name: `STRIPE_SECRET_KEY`
   - Value: your secret key
   - Save and redeploy.

That's it. The function reads the key server-side — it's never exposed to the
browser. Card data never touches your site; Stripe handles all of it (PCI
compliant by default).

### Optional: pre-made Stripe products
The function works two ways:
- **Inline pricing (default):** prices come straight from `index.html`. Just
  edit the catalog and you're done — no Stripe product setup needed.
- **Stripe Price IDs:** if you'd rather manage products inside Stripe, create
  them there, copy each `price_xxx` ID, and paste it into the matching
  product's `priceId` field in `index.html`.

---

## Editing your menu

Open `index.html`, find the `PRODUCTS` array near the bottom. Each item:

```js
{
  id:'classic-6',                 // unique, no spaces
  cat:'classic',                  // classic | letter | seasonal | gift
  name:'Classic Alfajores — 6 pack',
  es:'Alfajores clásicos',        // Spanish subtitle
  desc:'Buttery shortbread...',
  price:12,                       // USD
  emoji:'🍪',                     // placeholder image (see below)
  bg:'linear-gradient(...)',      // tile background
  badge:'Bestseller',             // small tag, or '' for none
  priceId:''                      // leave blank to use inline pricing
}
```

Change prices, add/remove items, rename — the cart and checkout update
automatically.

---

## Swapping in real photos (recommended)

Right now each product shows an emoji on a colored tile. To use your real
Instagram photos:

1. Add an `image/` folder with your photos (e.g. `image/classic.jpg`).
2. In `index.html`, find the product `.img` block in `renderProducts()` and
   replace the emoji line with:
   ```html
   <img src="${p.img}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover">
   ```
3. Add an `img:'image/classic.jpg'` field to each product.

I can do this for you — just send the photos.

---

## Things to update before launch

- **Email:** replace `hello@cherialfajores.com` with your real address
  (search the file for it — appears 3 times).
- **Instagram link:** confirm `instagram.com/cheri_alfajores` is correct.
- **Prices:** I estimated from your posts ($8–$11 seen). Set your real prices.
- **Pickup/delivery:** the checkout note says "Pickup & local delivery in
  Orlando." Stripe collects phone + address; tell customers your fulfillment
  details on the success page or in a follow-up.

---

## Deploy

1. Push these files to a GitHub repo (or drag-drop into Cloudflare Pages).
2. In Cloudflare: **Pages → Create project → Connect to Git** (or Direct
   Upload).
3. No build command needed — it's a static site. Output directory: `/`.
4. Add the `STRIPE_SECRET_KEY` env var (above) and deploy.

Done. Your store is live with secure payments.
