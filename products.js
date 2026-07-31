// Product catalog. Categories match the enum in the "product" objectSchema
// from the RudderStack tracking plan: camera, doorbell, floodlight, sensor, other.
const PRODUCTS = [
  {
    sku: "HH-CAM-V4",
    name: "SpotCam 4",
    category: "camera",
    price: 35.99,
    discount: false,
    icon: "📷",
    description: "1080p indoor smart camera with color night vision and person detection.",
    hasLiveDemo: true
  },
  {
    sku: "HH-CAM-PAN",
    name: "SpotCam Pan v3",
    category: "camera",
    price: 39.99,
    discount: true,
    icon: "🔄",
    description: "Pan & tilt indoor camera that follows the action with 360° coverage.",
    hasLiveDemo: true
  },
  {
    sku: "HH-CAM-OUT",
    name: "SpotCam Outdoor",
    category: "camera",
    price: 89.99,
    discount: false,
    icon: "🌦️",
    description: "Weatherproof, wire-free outdoor camera with up to 6-month battery life.",
    hasLiveDemo: true
  },
  {
    sku: "HH-CAM-PRO",
    name: "Battery Cam Pro",
    category: "camera",
    price: 59.99,
    discount: false,
    icon: "🔋",
    description: "Wire-free battery camera with color night vision and on-device AI detection.",
    hasLiveDemo: true
  },
  {
    sku: "HH-DB-PRO",
    name: "Video Doorbell Pro",
    category: "doorbell",
    price: 99.99,
    discount: true,
    icon: "🔔",
    description: "Hardwired video doorbell with head-to-toe view and pre-roll capture.",
    hasLiveDemo: true
  },
  {
    sku: "HH-DB-V2",
    name: "Video Doorbell v2",
    category: "doorbell",
    price: 49.99,
    discount: false,
    icon: "🚪",
    description: "Compact video doorbell with a 3:4 view and crisp two-way audio.",
    hasLiveDemo: true
  },
  {
    sku: "HH-FL-V2",
    name: "Floodlight Cam v2",
    category: "floodlight",
    price: 119.99,
    discount: false,
    icon: "💡",
    description: "2000-lumen floodlight with an integrated smart camera and built-in siren.",
    hasLiveDemo: true
  },
  {
    sku: "HH-SEN-CONTACT",
    name: "Contact Sensor",
    category: "sensor",
    price: 12.99,
    discount: false,
    icon: "🚧",
    description: "Detects when doors and windows open or close, day or night.",
    hasLiveDemo: false
  },
  {
    sku: "HH-SEN-MOTION",
    name: "Motion Sensor",
    category: "sensor",
    price: 14.99,
    discount: false,
    icon: "🏃",
    description: "Detects motion in a room and can trigger your cameras automatically.",
    hasLiveDemo: false
  },
  {
    sku: "HH-BASE",
    name: "Base Station",
    category: "other",
    price: 29.99,
    discount: false,
    icon: "📡",
    description: "Local storage hub that pairs with select wire-free cameras.",
    hasLiveDemo: false
  }
];

function findProduct(sku) {
  return PRODUCTS.find(p => p.sku === sku);
}

function formatPrice(amount) {
  return "$" + amount.toFixed(2);
}
