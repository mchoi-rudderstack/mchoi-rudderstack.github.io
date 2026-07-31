// ---------------------------------------------------------------------------
// Thin wrapper around window.rudderanalytics, plus one function per event in
// the tracking plan (datagov.json). Keeping the mapping in one place makes it
// easy to check every call against the required/optional properties.
//
// Two persisted demo identifiers stand in for real device/customer IDs:
//   - browserDeviceId  -> the "device_id" used for login/account_created,
//                         representing the customer's browser/device.
//   - shopifyCustomerId -> a stand-in for a Shopify-backed checkout, used on
//                         order_completed and subscription_* events.
// Camera-type products use their own SKU as "device_id" for camera/demo and
// subscription events, since those events are naturally per-camera.
// ---------------------------------------------------------------------------

function getOrCreateId(storageKey) {
  let id = localStorage.getItem(storageKey);
  if (!id) {
    id = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
    localStorage.setItem(storageKey, id);
  }
  return id;
}

const browserDeviceId = getOrCreateId("halo_browser_device_id");
const shopifyCustomerId = getOrCreateId("halo_shopify_customer_id");

function withRudder(fn) {
  if (window.rudderanalytics) {
    fn(window.rudderanalytics);
  } else {
    document.addEventListener("rudderstack:ready", () => fn(window.rudderanalytics), { once: true });
  }
}

function rsLog(event, properties) {
  // Visible in devtools console so the tracking plan can be verified without
  // needing access to the RudderStack dashboard.
  console.log("[RudderStack]", event, properties || {});
}

// -- App Lifecycle Events ----------------------------------------------------

function trackPage() {
  withRudder((rs) => rs.page());
  rsLog("page");
}

function identifyUser(userId, traits) {
  withRudder((rs) => rs.identify(userId, traits));
  rsLog("identify", traits);
}

// -- onboarding ---------------------------------------------------------------

function trackAccountCreated() {
  const props = { device_id: browserDeviceId };
  withRudder((rs) => rs.track("account_created", props));
  rsLog("account_created", props);
}

// -- App Lifecycle Events (account_updated lives in this category upstream) --

function trackAccountUpdated({ username, state, zipcode }) {
  const props = { username, state, zipcode };
  withRudder((rs) => rs.track("account_updated", props));
  rsLog("account_updated", props);
}

// -- conversion ----------------------------------------------------------------

function trackAddedToCart({ invoice_amount, product_name }) {
  const props = { invoice_amount, product_name };
  withRudder((rs) => rs.track("added_to_cart", props));
  rsLog("added_to_cart", props);
}

function trackFormSubmit() {
  withRudder((rs) => rs.track("form_submit"));
  rsLog("form_submit");
}

function trackProductViewed(product_name) {
  const props = { product_name };
  withRudder((rs) => rs.track("product_viewed", props));
  rsLog("product_viewed", props);
}

function trackOrderCompleted(order) {
  withRudder((rs) => rs.track("order_completed", order));
  rsLog("order_completed", order);
}

function trackSubscriptionStart(props) {
  withRudder((rs) => rs.track("subscription_start", props));
  rsLog("subscription_start", props);
}

function trackSubscriptionRenewal(props) {
  withRudder((rs) => rs.track("subscription_renewal", props));
  rsLog("subscription_renewal", props);
}

function trackSubscriptionUpgrade(props) {
  withRudder((rs) => rs.track("subscription_upgrade", props));
  rsLog("subscription_upgrade", props);
}

// -- general --------------------------------------------------------------------

function trackLogin() {
  const props = { device_id: browserDeviceId };
  withRudder((rs) => rs.track("login", props));
  rsLog("login", props);
}

function trackPdpViewed(product) {
  const props = {
    product: {
      product_name: product.name,
      sku: product.sku,
      category: product.category,
      discount: product.discount
    }
  };
  withRudder((rs) => rs.track("pdp_viewed", props));
  rsLog("pdp_viewed", props);
}

// -- Camera Events ----------------------------------------------------------------

function trackCameraActivated(deviceId) {
  const props = { device_id: deviceId };
  withRudder((rs) => rs.track("camera_activated", props));
  rsLog("camera_activated", props);
}

function trackLiveView(deviceId) {
  const props = { device_id: deviceId };
  withRudder((rs) => rs.track("live_view", props));
  rsLog("live_view", props);
}

function trackMotionDetected(deviceId) {
  const props = { device_id: deviceId };
  withRudder((rs) => rs.track("motion_detected", props));
  rsLog("motion_detected", props);
}

function trackAlarmTriggered(deviceId) {
  const props = { device_id: deviceId };
  withRudder((rs) => rs.track("alarm_triggered", props));
  rsLog("alarm_triggered", props);
}

function trackLowBatteryNotice(deviceId) {
  const props = { device_id: deviceId };
  withRudder((rs) => rs.track("low_battery_notice", props));
  rsLog("low_battery_notice", props);
}

function trackVideoClipViewed(deviceId) {
  const props = { device_id: deviceId };
  withRudder((rs) => rs.track("video_clip_viewed", props));
  rsLog("video_clip_viewed", props);
}

// Note: "screen" (mobile-only) and the deprecated "ViewProduct" event from the
// tracking plan are intentionally not implemented on this web storefront.
