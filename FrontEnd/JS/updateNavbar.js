document.addEventListener('DOMContentLoaded', function () {
  updateNavbar();
  const email = localStorage.getItem('email');
    const navUser = document.getElementById('nav-user');
    const usernameDisplay = document.getElementById('usernameDisplay');
    const navAuth = document.getElementById('nav-auth');
    updateNavbar();
  
    if (email) {
      usernameDisplay.textContent = email;
      navUser.style.display = 'inline-block';
      navAuth.style.display = 'none';
    } else {
      navUser.style.display = 'none';
      navAuth.style.display = 'inline-block';
    }
  });
  
  function logout() {
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
    window.location.href = "../HTML/Welcome2.html"; // or login page
  }

  function updateNavbar() {
    const userEmail = localStorage.getItem('email') || sessionStorage.getItem('email');
    const navUser = document.getElementById('nav-user');
  
    if (userEmail) {
      navUser.style.display = 'block';
      document.getElementById('usernameDisplay').textContent = userEmail.split('@')[0];
      updateCartCountFromServer(); // Add this line to update count when navbar updates
    } else {
      navUser.style.display = 'none';
      updateCartCount(0);
    }
  }

  // Function to update cart count display
function updateCartCount(count) {
  const cartCountElements = document.querySelectorAll('.cart-count');
  cartCountElements.forEach(element => {
    element.textContent = count;
  });
}

// Function to fetch and update cart count from server
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
    }
  } catch (error) {
    console.error('Error fetching cart count:', error);
    updateCartCount(0);
  }
}
  
  