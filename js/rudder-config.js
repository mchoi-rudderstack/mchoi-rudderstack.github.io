// ---------------------------------------------------------------------------
// RudderStack JavaScript SDK setup.
//
// 1. Create a "JavaScript" source in your RudderStack workspace
//    (workspace_id: 2dMWEeLnSRRwA91xQIDIOvJrCyH) and copy its Write Key.
// 2. Grab your Data Plane URL from Connections > your source > Setup.
// 3. Paste both below.
//
// Note: https://cdn.rudderlabs.com/v3/rudder-analytics.min.js (and other
// /v3/* paths) currently 403 from this CDN - the working, actively-updated
// bundle is served from /v1.1/. That bundle assigns a ready-to-use
// `window.rudderanalytics` object itself (with .load/.page/.track/.identify
// already on it), so there's no `new RudderAnalytics()` step - calling that
// on this bundle would throw since `window.RudderAnalytics` doesn't exist.
// ---------------------------------------------------------------------------

const RUDDERSTACK_WRITE_KEY = "2OvV4mlg8kveN6sdbImEy5hRnyG";
const RUDDERSTACK_DATA_PLANE_URL = "https://rudderstacodk.dataplane.rudderstack.com";

(function loadRudderStack() {
  var script = document.createElement("script");
  script.src = "https://cdn.rudderlabs.com/v1.1/rudder-analytics.min.js";
  script.async = true;
  script.onload = function () {
    window.rudderanalytics.load(RUDDERSTACK_WRITE_KEY, RUDDERSTACK_DATA_PLANE_URL);
    document.dispatchEvent(new Event("rudderstack:ready"));
  };
  document.head.appendChild(script);
})();
