document.addEventListener('DOMContentLoaded', () => {
  // Only add listeners to existing buttons
  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  if (addToCartButtons.length > 0) {
    addToCartButtons.forEach(button => {
      button.addEventListener('click', handleAddToCart);
    });
  }

  updateNavbar();
  updateCartCountFromServer();
});

async function handleAddToCart(event) {
  const button = event.target;
  // Look for closest parent with data-service-id attribute
  const serviceCard = button.closest('[data-service-id]');

  if (!serviceCard) {
    console.error('Could not find service card element');
    return;
  }

  const serviceId = serviceCard.dataset.serviceId;
  const userEmail = localStorage.getItem('email') || sessionStorage.getItem('email');

  if (!userEmail) {
    alert('Please login to add items to your cart');
    window.location.href = '../HTML/login.html';
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/users/addToCart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: userEmail, serviceId })
    });

    const data = await response.json();

    if (data.success) {
      const cartItem = data.cart.find(item => item.serviceId === serviceId);
      const newQuantity = cartItem ? cartItem.quantity : 0;

      updateCartUI(serviceCard, newQuantity);
      updateCartCount(data.cart.reduce((total, item) => total + item.quantity, 0));
    } else {
      alert(data.message || 'Failed to add to cart');
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    alert('Failed to add to cart. Please try again.');
  }
}

async function handleRemoveFromCart(serviceId) {
  const userEmail = localStorage.getItem('email') || sessionStorage.getItem('email');

  try {
    const response = await fetch('http://localhost:5000/api/users/removeFromCart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: userEmail, serviceId })
    });

    const data = await response.json();

    if (data.success) {
      // Find the card by data-service-id attribute (works for both food and grooming)
      const serviceCard = document.querySelector(`[data-service-id="${serviceId}"]`);
      if (serviceCard) {
        const cartItem = data.cart.find(item => item.serviceId === serviceId);
        const newQuantity = cartItem ? cartItem.quantity : 0;

        updateCartUI(serviceCard, newQuantity);
      }
      updateCartCount(data.cart.reduce((total, item) => total + item.quantity, 0));
    } else {
      alert(data.message || 'Failed to remove from cart');
    }
  } catch (error) {
    console.error('Error removing from cart:', error);
    alert('Failed to remove from cart. Please try again.');
  }
}

function updateCartUI(serviceCard, quantity) {
  const serviceId = serviceCard.dataset.serviceId;

  // Find the controls container - works for both grooming and food pages
  let controlsContainer = serviceCard.querySelector('.quantity-controls');
  
  // If no specific controls container, use the card itself for grooming pages
  if (!controlsContainer) {
    controlsContainer = serviceCard;
  }

  // Update quantity display
  let quantityDisplay = controlsContainer.querySelector('.quantity-display');
  if (quantity > 0) {
    if (!quantityDisplay) {
      quantityDisplay = document.createElement('span');
      quantityDisplay.className = 'quantity-display';
      // For grooming cards, insert before the add-to-cart button
      const addButton = controlsContainer.querySelector('.add-to-cart');
      if (addButton) {
        addButton.insertAdjacentElement('beforebegin', quantityDisplay);
      } else {
        controlsContainer.appendChild(quantityDisplay);
      }
    }
    quantityDisplay.textContent = quantity;
  } else if (quantityDisplay) {
    quantityDisplay.remove();
  }

  // Handle minus button
  const minusButton = controlsContainer.querySelector('.remove-from-cart');
  if (quantity > 0) {
    if (!minusButton) {
      const newMinusButton = document.createElement('button');
      newMinusButton.className = 'remove-from-cart';
      newMinusButton.textContent = '-';
      newMinusButton.addEventListener('click', () => handleRemoveFromCart(serviceId));
      
      // For grooming cards, insert before the quantity display
      const quantityDisplay = controlsContainer.querySelector('.quantity-display');
      const addButton = controlsContainer.querySelector('.add-to-cart');
      
      if (quantityDisplay) {
        quantityDisplay.insertAdjacentElement('beforebegin', newMinusButton);
      } else if (addButton) {
        addButton.insertAdjacentElement('beforebegin', newMinusButton);
      } else {
        controlsContainer.appendChild(newMinusButton);
      }
    }
  } else if (minusButton) {
    minusButton.remove();
  }
}

async function updateCartCountFromServer() {
  const userEmail = localStorage.getItem('email') || sessionStorage.getItem('email');

  if (!userEmail) {
    updateCartCount(0);
    return;
  }

  try {
    const response = await fetch(`http://localhost:5000/api/users/me?email=${userEmail}`);
    if (!response.ok) throw new Error('Failed to fetch user data');

    const userData = await response.json();
    if (userData.success && userData.data.cart) {
      const totalItems = userData.data.cart.reduce((total, item) => total + item.quantity, 0);
      updateCartCount(totalItems);

      // Update individual service quantities for both grooming and food items
      userData.data.cart.forEach(item => {
        // Look for both grooming service cards and food items
        const serviceCard = document.querySelector(`
          [data-service-id="${item.serviceId}"],
          .service-card[data-service-id="${item.serviceId}"],
          .illness-card[data-service-id="${item.serviceId}"],
          .treat-card[data-service-id="${item.serviceId}"]
        `);
        if (serviceCard) {
          updateCartUI(serviceCard, item.quantity);
        }
      });
    }
  } catch (error) {
    console.error('Error fetching cart count:', error);
    updateCartCount(0);
  }
}

function updateCartCount(count) {
  const cartCountElements = document.querySelectorAll('.cart-count');
  cartCountElements.forEach(element => {
    element.textContent = count;
  });
}

function updateNavbar() {
  const userEmail = localStorage.getItem('email') || sessionStorage.getItem('email');
  const navUser = document.getElementById('nav-user');

  if (userEmail) {
    navUser.style.display = 'block';
    document.getElementById('usernameDisplay').textContent = userEmail.split('@')[0];
  } else {
    navUser.style.display = 'none';
  }
}