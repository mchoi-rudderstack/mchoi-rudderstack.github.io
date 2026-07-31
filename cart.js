// Cart persistence (localStorage) shared across pages.

function getCart() {
  try {
    return JSON.parse(localStorage.getItem("halo_cart") || "[]");
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem("halo_cart", JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(product, qty) {
  const cart = getCart();
  const existing = cart.find((item) => item.sku === product.sku);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      sku: product.sku,
      name: product.name,
      category: product.category,
      price: product.price,
      discount: product.discount,
      qty
    });
  }
  saveCart(cart);
}

function removeFromCart(sku) {
  saveCart(getCart().filter((item) => item.sku !== sku));
}

function setQty(sku, qty) {
  const cart = getCart();
  const item = cart.find((i) => i.sku === sku);
  if (item) {
    item.qty = Math.max(1, qty);
    saveCart(cart);
  }
}

function clearCart() {
  localStorage.removeItem("halo_cart");
  updateCartBadge();
}

function cartCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

function cartSubtotal() {
  return getCart().reduce((sum, item) => sum + item.price * item.qty, 0);
}

function updateCartBadge() {
  const badge = document.getElementById("cart-count");
  if (badge) badge.textContent = cartCount();
}

document.addEventListener("DOMContentLoaded", updateCartBadge);
