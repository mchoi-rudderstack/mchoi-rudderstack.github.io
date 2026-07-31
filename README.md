# HaloHome — Smart Home Security Store

A static ecommerce storefront (cameras, doorbells, floodlights, sensors) with
RudderStack JS SDK tracking wired in for every event in the `datagov.json`
tracking plan (workspace `2dMWEeLnSRRwA91xQIDIOvJrCyH`).

No build step — plain HTML/CSS/JS.

## Run it

```
cd halohome-store
python3 -m http.server 8000
```

Then open `http://localhost:8000`. (A local server is used instead of
opening the files directly so the RudderStack CDN script always resolves
paths correctly.)

## Connect RudderStack

1. In your RudderStack workspace, create a **JavaScript** source and copy its
   **Write Key**.
2. Copy the source's **Data Plane URL** (Connections → source → Setup).
3. Open `js/rudder-config.js` and replace:
   ```js
   const RUDDERSTACK_WRITE_KEY = "<YOUR_WRITE_KEY>";
   const RUDDERSTACK_DATA_PLANE_URL = "<YOUR_DATA_PLANE_URL>";
   ```
4. Reload the site. Every tracked call is also mirrored to the browser
   devtools console (`[RudderStack] event_name {...}`) so you can verify
   properties without needing dashboard access.

## Pages → events

| Page | Events fired |
|---|---|
| Every page | `page` on load |
| `login.html` | `login`, `account_created`, `identify` |
| `index.html` | `product_viewed` (Quick View), `form_submit` (newsletter) |
| `product.html` | `pdp_viewed`, `added_to_cart`, `camera_activated`, `live_view`, `motion_detected`, `alarm_triggered`, `low_battery_notice`, `video_clip_viewed` (device demo panel, shown for camera/doorbell/floodlight products) |
| `checkout.html` | `order_completed` (one per line item), `identify` |
| `account.html` | `account_updated`, `subscription_start`, `subscription_renewal`, `subscription_upgrade` |

All property names/types/required flags follow `datagov.json` exactly — see
`js/analytics.js` for the one-function-per-event mapping.

**Intentionally not implemented:** `screen` (mobile-only, no web equivalent)
and `ViewProduct` (marked `Deprecated` in the tracking plan, superseded by
`product_viewed`/`pdp_viewed`).

## Demo identifiers

Since there's no real backend, a few IDs are generated and persisted in
`localStorage` to stand in for real system IDs:

- `halo_browser_device_id` → `device_id` on `login`/`account_created`
- `halo_shopify_customer_id` → `shopify_customer_id` on `order_completed` and subscription events
- Product SKUs double as `device_id` for camera/doorbell demo and subscription events, since those are naturally per-camera

## Structure

```
index.html       Home / product listing
product.html      PDP with add-to-cart + live device demo
cart.html         Cart
checkout.html     Checkout + order confirmation
login.html        Sign in / create account
account.html      Profile, order history, Cam Plus subscriptions
js/products.js     Product catalog (10 SKUs across camera/doorbell/floodlight/sensor/other)
js/rudder-config.js  RudderStack SDK load snippet
js/analytics.js    One tracking function per event, mapped to datagov.json
js/cart.js         localStorage cart helpers
css/style.css      Shared styling
```
