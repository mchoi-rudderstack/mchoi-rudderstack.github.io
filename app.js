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

  document.getElementById("image-modal").addEventListener("click", (e) => {
    if (e.target.id === "image-modal") {
      closeImageModal();
    }
  });
});

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.remove("opacity-0");
  toast.classList.add("opacity-100");

  setTimeout(() => {
    toast.classList.remove("opacity-100");
    toast.classList.add("opacity-0");
  }, 2000);
}

// Helper function to track RudderStack events with logging
function trackEvent(eventName, properties) {
  if (typeof rudderanalytics !== "undefined" && typeof rudderanalytics.track === "function") {
    console.log(`Tracking event: ${eventName}`, properties);
    try {
      rudderanalytics.track(eventName, properties);
      rudderanalytics.flush();
      console.log(`Event sent to RudderStack: ${eventName}`);
      console.log("RudderStack queue after track", window.rudderanalytics);
      if (typeof rudderanalytics.getState === "function") {
        console.log("RudderStack SDK state", rudderanalytics.getState());
      }
    } catch (error) {
      console.error(`Error sending event to RudderStack: ${eventName}`, error);
    }
  } else {
    console.log(`RudderStack SDK not loaded. Queuing event: ${eventName}`, properties);
    console.log("Current RudderStack queue", window.rudderanalytics);
    window.rudderanalytics = window.rudderanalytics || [];
    window.rudderanalytics.push(["track", eventName, properties]);
  }
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  const existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  trackEvent("Product Added", {
    product_id: product.id,
    name: product.name,
    price: product.price,
    quantity: existing ? existing.qty : 1,
    currency: "USD"
  });

  showToast(`${product.name} added to cart!`);
}

function toggleCart() {
  const modal = document.getElementById("cart-modal");
  modal.classList.toggle("hidden");

  if (!modal.classList.contains("hidden")) {
    trackEvent("Cart Viewed", {
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
  const firstName = document.getElementById("first-name").value.trim();
  const lastName = document.getElementById("last-name").value.trim();
  const deliveryAddress = document.getElementById("delivery-address").value.trim();

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cartItems = cart.map(item => ({
    product_id: item.id,
    name: item.name,
    price: item.price,
    quantity: item.qty
  }));

  if (typeof rudderanalytics !== "undefined" && typeof rudderanalytics.identify === "function") {
    // const email = localStorage.getItem("userEmail") || undefined;
    // console.log("Identifying user", { email, firstName, lastName, deliveryAddress });
    // try {
    //   rudderanalytics.identify(email, {
    //     first_name: firstName,
    //     last_name: lastName,
    //     delivery_address: deliveryAddress
    //   });
    //   rudderanalytics.flush();
    //   console.log("Identify event sent to RudderStack");
    //   console.log("RudderStack queue after identify", window.rudderanalytics);
    //   if (typeof rudderanalytics.getState === "function") {
    //     console.log("RudderStack SDK state", rudderanalytics.getState());
    //   }
    // } catch (error) {
    //   console.error("Error sending identify event to RudderStack", error);
    // }

    trackEvent("Checkout Completed", {
      cart_items: cartItems,
      total: cartTotal,
      currency: "USD"
    }, {
      context: {
        traits: {
          first_name: firstName,
          last_name: lastName,
          delivery_address: deliveryAddress
        }
      }
    });
  } else {
    console.log("RudderStack SDK not loaded. Queuing identify and checkout events");
    console.log("Current RudderStack queue", window.rudderanalytics);
    window.rudderanalytics = window.rudderanalytics || [];
    // window.rudderanalytics.push(["identify", email, {
    //   first_name: firstName,
    //   last_name: lastName,
    //   delivery_address: deliveryAddress
    // }]);
    window.rudderanalytics.push(["track", "Checkout Completed", {
      cart_items: cartItems,
      total: cartTotal,
      currency: "USD"
    }]);
  }

  showToast("Checkout complete");
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
    showToast("Please enter both email and password");
    return;
  }

  if (typeof rudderanalytics !== "undefined" && typeof rudderanalytics.identify === "function") {
    console.log("Identifying user on sign-in", { email });
    try {
      rudderanalytics.identify(email, {
        email: email
      });
      rudderanalytics.flush();
      console.log("Identify event sent to RudderStack for sign-in");
      console.log("RudderStack queue after identify", window.rudderanalytics);
      if (typeof rudderanalytics.getState === "function") {
        console.log("RudderStack SDK state", rudderanalytics.getState());
      }
    } catch (error) {
      console.error("Error sending identify event for sign-in to RudderStack", error);
    }
  } else {
    console.log("RudderStack SDK not loaded. Queuing identify event for sign-in");
    console.log("Current RudderStack queue", window.rudderanalytics);
    window.rudderanalytics = window.rudderanalytics || [];
    window.rudderanalytics.push(["identify", email, {
      email: email,
      signed_in_at: new Date().toISOString()
    }]);
  }

  localStorage.setItem("userEmail", email);
  toggleSignIn();
  updateToSignOutButton();
}

function signOut() {
  if (typeof rudderanalytics !== "undefined" && typeof rudderanalytics.reset === "function") {
    console.log("Resetting RudderStack user session");
    try {
      rudderanalytics.reset();
      rudderanalytics.flush();
      console.log("Reset event sent to RudderStack");
      console.log("RudderStack queue after reset", window.rudderanalytics);
      if (typeof rudderanalytics.getState === "function") {
        console.log("RudderStack SDK state", rudderanalytics.getState());
      }
    } catch (error) {
      console.error("Error sending reset event to RudderStack", error);
    }
  } else {
    console.log("RudderStack SDK not loaded. Queuing reset event");
    console.log("Current RudderStack queue", window.rudderanalytics);
    window.rudderanalytics = window.rudderanalytics || [];
    window.rudderanalytics.push(["reset"]);
  }

  localStorage.removeItem("userEmail");

  showToast("You have signed out.");
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
    trackEvent("Product Viewed", {
      product_id: product.id,
      name: product.name,
      price: product.price,
      currency: "USD"
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
