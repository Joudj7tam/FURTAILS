document.addEventListener('DOMContentLoaded', function () {
    const email = localStorage.getItem('email');
    const navUser = document.getElementById('nav-user');
    const usernameDisplay = document.getElementById('usernameDisplay');
    const navAuth = document.getElementById('nav-auth');
  
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
  
  