document.addEventListener("DOMContentLoaded", async () => {
  const email = localStorage.getItem("email"); // assuming you saved it earlier
  const cartContainer = document.getElementById("cart-items-container");
  const emptyCart = document.querySelector(".cart-empty");
  const subtotalElement = document.querySelector(".cart-total-details p:nth-of-type(2)");
  const totalElement = document.querySelector(".cart-total-details b:nth-of-type(2)");
  const deliveryFee = 2;

  try {
    const res = await fetch(`http://localhost:5000/api/users/cart-by-email?email=${email}`);
    const data = await res.json();

    if (data.success && data.items.length > 0) {
      emptyCart.style.display = "none";

      cartContainer.innerHTML = "";
      let subtotal = 0;

      data.items.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        const itemDiv = document.createElement("div");
        itemDiv.classList.add("cart-items-item");

        itemDiv.innerHTML = `
          <div class="cart-item-detail">
            <img src="/uploads/${item.image}" alt="${item.name}" />
          </div>
          <div class="cart-item-detail">
            <p>${item.name}</p>
          </div>
          <div class="cart-item-detail">
            <p>$${item.price.toFixed(2)}</p>
          </div>
          <div class="cart-item-detail">
            <p>${item.quantity}</p>
          </div>
          <div class="cart-item-detail">
            <p>$${itemTotal.toFixed(2)}</p>
          </div>
          <div class="cart-item-detail cross" data-id="${item._id}">
            X
          </div>
        `;

        cartContainer.appendChild(itemDiv);
      });

      subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
      totalElement.textContent = `$${(subtotal + deliveryFee).toFixed(2)}`;
    } else {
      emptyCart.style.display = "flex";
    }

    // Setup remove buttons
    cartContainer.addEventListener("click", async (e) => {
      if (e.target.classList.contains("cross")) {
        const serviceId = e.target.getAttribute("data-id");
        const response = await fetch("http://localhost:5000/api/users/removeFromCart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, serviceId }),
        });

        const result = await response.json();
        if (result.success) {
          window.location.reload(); // re-fetch cart after removing
        }
      }
    });

  } catch (error) {
    console.error("Error loading cart:", error);
  }
});
