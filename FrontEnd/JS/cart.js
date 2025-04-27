document.addEventListener("DOMContentLoaded", async () => {
  const email = localStorage.getItem("email");
  const cartContainer = document.getElementById("cart-items-container"); // Fixed selector (removed dot)
  const emptyCart = document.querySelector(".cart-empty");
  const subtotalElement = document.querySelector(".cart-total-details p:nth-of-type(2)");
  const totalElement = document.querySelector(".cart-total-details b:nth-of-type(2)");
  const deliveryFee = 2.00;
  const petSelect = document.getElementById("pet-select");

  try {

    // Load user's pets first
    const petsRes = await fetch(`http://localhost:5000/api/users/pets?email=${email}`);
    const petsData = await petsRes.json();
    console.log(petsData.pets);
 
    if (petsData.success && petsData.pets.length > 0) {
      // Add user's pets to dropdown
      petsData.pets.forEach(pet => {
        const option = document.createElement("option");
        option.value = pet.name;
        option.textContent = pet.name;
        petSelect.appendChild(option);
      });
    }

    const res = await fetch(`http://localhost:5000/api/users/cart-by-email?email=${email}`);
    const data = await res.json();
    console.log("Cart API Response:", data); 

    if (data.success && data.items.length > 0) {
      emptyCart.style.display = "none";
      cartContainer.innerHTML = ""; // Clear existing items
      let subtotal = 0;

      data.items.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        // Create cart item elements dynamically
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("cart-items-item");

        // Image
        /*const imgDiv = document.createElement("div");
        imgDiv.classList.add("cart-item-detail");
        const img = document.createElement("img");
        img.src = item.photo;
        img.alt = item.name;
        imgDiv.appendChild(img);*/

        // Name
        const nameDiv = document.createElement("div");
        nameDiv.classList.add("cart-item-detail");
        const namePara = document.createElement("p");
        namePara.textContent = item.name;
        nameDiv.appendChild(namePara);

        // Price
        const priceDiv = document.createElement("div");
        priceDiv.classList.add("cart-item-detail");
        const pricePara = document.createElement("p");
        pricePara.textContent = `$${item.price.toFixed(2)}`;
        priceDiv.appendChild(pricePara);

        // Quantity
        const qtyDiv = document.createElement("div");
        qtyDiv.classList.add("cart-item-detail");
        const qtyPara = document.createElement("p");
        qtyPara.textContent = item.quantity;
        qtyDiv.appendChild(qtyPara);

        // Total
        const totalDiv = document.createElement("div");
        totalDiv.classList.add("cart-item-detail");
        const totalPara = document.createElement("p");
        totalPara.textContent = `$${itemTotal.toFixed(2)}`;
        totalDiv.appendChild(totalPara);

        // Remove button (X)
        const removeDiv = document.createElement("div");
        removeDiv.classList.add("cart-item-detail", "cross");
        removeDiv.dataset.id = item._id;
        removeDiv.textContent = "X";

        // Append all elements to itemDiv
        itemDiv.append(/*imgDiv,*/ nameDiv, priceDiv, qtyDiv, totalDiv, removeDiv);
        cartContainer.appendChild(itemDiv);
      });

      // Update subtotal & total
      subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
      totalElement.textContent = `$${(subtotal + deliveryFee).toFixed(2)}`;
    } else {
      emptyCart.style.display = "flex";
    }

    // Remove item event listener (unchanged)
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
          window.location.reload();
        }
      }
    });
  } catch (error) {
    console.error("Error loading cart:", error);
  }
});


document.getElementById("checkoutBtn").addEventListener("click", async () => {
  const email = localStorage.getItem("email");

  const firstName = document.querySelector("input[placeholder='First Name']").value.trim();
  const lastName = document.querySelector("input[placeholder='Last Name']").value.trim();
  const street = document.querySelector("input[placeholder='Street']").value.trim();
  const city = document.querySelector("input[placeholder='City']").value.trim();
  const state = document.querySelector("input[placeholder='State']").value.trim();
  const zipCode = document.querySelector("input[placeholder='Zip Code']").value.trim();
  const country = document.querySelector("input[placeholder='Country']").value.trim();
  const phone = document.querySelector("input[placeholder='Phone']").value.trim();
  const pet = document.getElementById("pet-select").value;

  if (!firstName || !lastName || !street || !city || !state || !zipCode || !country || !phone || !pet) {
    alert("Please fill in all the required fields.");
    return;
  }

  try {
    const cartRes = await fetch(`http://localhost:5000/api/users/cart-by-email?email=${email}`);
    const cartData = await cartRes.json();

    if (!cartData.success || cartData.items.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    const cartItems = cartData.items.map(item => item._id);
    const totalPrice = cartData.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const orderRes = await fetch("http://localhost:5000/api/order/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        street,
        city,
        state,
        zipCode,
        country,
        phone,
        pet,
        cartData: cartItems,
        totalPrice
      })
    });

    const orderResult = await orderRes.json();

    if (orderResult.success) {
      await fetch("http://localhost:5000/api/users/clearCart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      // Show the success modal only if everything succeeded
      document.getElementById("completeOrderModal").style.display = "block";
    } else {
      alert("Failed to place the order. Try again.");
    }
  } catch (err) {
    
  }
});
