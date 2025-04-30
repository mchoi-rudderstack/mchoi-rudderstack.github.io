// Updated app.js

const products = [
  {
    id: 1,
    name: "Mickey Mouse Hoodie",
    price: 49.99,
    image: "https://cdn-ssl.s7.shopdisney.com/is/image/DisneyShopping/2400107790627?fmt=webp&qlt=70&wid=608&hei=608"
  },
  {
    id: 2,
    name: "Frozen Elsa Doll",
    price: 29.99,
    image: "https://cdn-ssl.s7.shopdisney.com/is/image/DisneyShopping/1612040900162?fmt=webp&qlt=70&wid=1280&hei=1280"
  },
  {
    id: 3,
    name: "Marvel Avengers T-Shirt",
    price: 24.99,
    image: "https://cdn-ssl.s7.shopdisney.com/is/image/DisneyShopping/2412048020764?fmt=webp&qlt=70&wid=1280&hei=1280"
  }
];

const cart = [];

document.addEventListener("DOMContentLoaded", () => {
  const productList = document.getElementById("product-list");

  products.forEach(product => {
    const card = document.createElement("div");
    card.className = "bg-white rounded-xl shadow-lg p-4 text-center";

    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" onclick="openImageModal('${product.image}')" class="h-48 w-full object-contain rounded-lg mb-4 bg-white cursor-pointer transform transition-transform duration-300 hover:scale-105" />
      <h2 class="text-xl font-semibold">${product.name}</h2>
      <p class="text-sm text-gray-600">$${product.price.toFixed(2)}</p>
      <button class="mt-3 bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800" onclick="addToCart(${product.id})">Add to Cart</button>
    `;

    productList.appendChild(card);
  });

  document.getElementById("cart-btn").addEventListener("click", toggleCart);
});

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  const existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  rudderanalytics.ready(() => {
    rudderanalytics.track("Product Added", {
      product_id: product.id,
      name: product.name,
      price: product.price,
      quantity: existing ? existing.qty : 1,
      currency: "USD"
    });
  });

  alert(`${product.name} added to cart!`);
}

function toggleCart() {
  const modal = document.getElementById("cart-modal");
  modal.classList.toggle("hidden");

  if (!modal.classList.contains("hidden")) {
    rudderanalytics.track("Cart Viewed", {
      cart_items: cart.map(item => ({
        product_id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.qty
      })),
      total: cart.reduce((sum, item) => sum + item.price * item.qty, 0),
      currency: "USD"
    });
  }

  renderCart();
}

function renderCart() {
  const cartItems = document.getElementById("cart-items");
  cartItems.innerHTML = "";

  let total = 0;

  cart.forEach(item => {
    const li = document.createElement("li");
    li.className = "flex justify-between";
    li.innerHTML = `
      <span>${item.name} x${item.qty}</span>
      <span>$${(item.price * item.qty).toFixed(2)}</span>
    `;
    total += item.price * item.qty;
    cartItems.appendChild(li);
  });

  document.getElementById("total").textContent = `Total: $${total.toFixed(2)}`;
}

function checkout() {
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cartItems = cart.map(item => ({
    product_id: item.id,
    name: item.name,
    price: item.price,
    quantity: item.qty
  }));

  rudderanalytics.ready(() => {
    rudderanalytics.track("Checkout Completed", {
      cart_items: cartItems,
      total: cartTotal,
      currency: "USD"
    });
  });

  alert("Checkout complete");
  cart.length = 0;
  toggleCart();
}

function toggleSignIn() {
  document.getElementById("signin-modal").classList.toggle("hidden");
}

function signIn() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Please enter both email and password");
    return;
  }

  rudderanalytics.ready(() => {
    rudderanalytics.identify(email, {
      email: email,
      signed_in_at: new Date().toISOString()
    });
  });

  toggleSignIn();
  updateToSignOutButton();
}

function signOut() {
  rudderanalytics.ready(() => {
    rudderanalytics.reset();
  });
  alert("You have signed out.");
  const authSection = document.getElementById("auth-section");
  authSection.innerHTML = '<button onclick="toggleSignIn()" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">🔐 Sign In</button>';
}

function updateToSignOutButton() {
  const authSection = document.getElementById("auth-section");
  authSection.innerHTML = '<button onclick="signOut()" class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">🚪 Sign Out</button>';
}

function openImageModal(imageUrl) {
  const product = products.find(p => p.image === imageUrl);
  if (product) {
    rudderanalytics.ready(() => {
      rudderanalytics.track("Product Viewed", {
        product_id: product.id,
        name: product.name,
        price: product.price,
        currency: "USD"
      });
    });
  }

  const modal = document.getElementById("image-modal");
  const modalImg = document.getElementById("modal-img");
  modalImg.src = imageUrl;
  modal.classList.remove("hidden");
}

function closeImageModal() {
  const modal = document.getElementById("image-modal");
  modal.classList.add("hidden");
}