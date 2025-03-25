const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

// Function to toggle password visibility and switch icons
function togglePasswordVisibility(passwordField, eyeIcon) {
    if (passwordField.type === "password") {
        passwordField.type = "text";
        eyeIcon.src = "../Media/hide.png"; // Switch to "hide" icon
    } else {
        passwordField.type = "password";
        eyeIcon.src = "../Media/view.png"; // Switch to "view" icon
    }
}

// Add event listeners for the eye icons in the Sign Up form
document.getElementById('signup-eye').addEventListener('click', function() {
    const passwordField = document.getElementById('signup-password');
    togglePasswordVisibility(passwordField, this);
});

document.getElementById('signup-confirm-eye').addEventListener('click', function() {
    const passwordField = document.getElementById('signup-confirm-password');
    togglePasswordVisibility(passwordField, this);
});

// Add event listeners for the eye icons in the Sign In form
document.getElementById('signin-eye').addEventListener('click', function() {
    const passwordField = document.getElementById('signin-password');
    togglePasswordVisibility(passwordField, this);
});

//toggle for smaller screens
// Mobile toggle functionality
const mobileSignInBtn = document.getElementById('mobileSignInBtn');
const mobileSignUpBtn = document.getElementById('mobileSignUpBtn');
const signInForm = document.querySelector('.sign-in');
const signUpForm = document.querySelector('.sign-up');

function toggleMobileForms() {
  mobileSignInBtn.classList.toggle('active');
  mobileSignUpBtn.classList.toggle('active');
  
  signInForm.classList.toggle('active');
  signUpForm.classList.toggle('active');
}

mobileSignInBtn.addEventListener('click', () => {
  if (!mobileSignInBtn.classList.contains('active')) {
    toggleMobileForms();
  }
});

mobileSignUpBtn.addEventListener('click', () => {
  if (!mobileSignUpBtn.classList.contains('active')) {
    toggleMobileForms();
  }
});

// Initialize - show sign in by default
signInForm.classList.add('active');

// In login.js
document.getElementById('signupForm').addEventListener('submit', function(e) {
  e.preventDefault();
  // Validate form
  if(validateSignUp()) {
      // Submit form data (you would typically use fetch/AJAX here)
      window.location.href = "../HTML/HomePage.html";
  }
});

document.getElementById('signinForm').addEventListener('submit', function(e) {
  e.preventDefault();
  // Validate form
  if(validateSignIn()) {
      // Submit form data
      window.location.href = "../HTML/HomePage.html";
  }
});

function validateSignUp() {
  // Add validation logic
  return true; // Return false if validation fails
}

function validateSignIn() {
  // Add validation logic
  return true; // Return false if validation fails
}

document.addEventListener('DOMContentLoaded', function() {
  // Password visibility toggle for all eye icons
  function setupEyeIcons() {
      // Reset password eye icons
      const resetEye = document.getElementById('reset-eye');
      const resetConfirmEye = document.getElementById('reset-confirm-eye');
      const resetPassword = document.getElementById('reset-password');
      const resetConfirmPassword = document.getElementById('reset-confirm-password');
      
      if (resetEye && resetPassword) {
          resetEye.addEventListener('click', function() {
              togglePasswordVisibility(resetPassword, resetEye);
          });
      }
      
      if (resetConfirmEye && resetConfirmPassword) {
          resetConfirmEye.addEventListener('click', function() {
              togglePasswordVisibility(resetConfirmPassword, resetConfirmEye);
          });
      }
      
      // Existing form eye icons (if needed)
      const signupEye = document.getElementById('signup-eye');
      const signupPassword = document.getElementById('signup-password');
      
      if (signupEye && signupPassword) {
          signupEye.addEventListener('click', function() {
              togglePasswordVisibility(signupPassword, signupEye);
          });
      }
  }
  
  // Toggle password visibility function
  function togglePasswordVisibility(passwordField, eyeIcon) {
      if (passwordField.type === 'password') {
          passwordField.type = 'text';
          eyeIcon.src = '../Media/hide.png'; // Make sure you have this image
      } else {
          passwordField.type = 'password';
          eyeIcon.src = '../Media/view.png';
      }
  }
  
  // Form submission handler
  function setupFormSubmission() {
      const resetForm = document.getElementById('resetPasswordForm');
      
      if (resetForm) {
          resetForm.addEventListener('submit', function(e) {
              e.preventDefault();
              
              // Get form values
              const email = this.querySelector('input[type="email"]').value;
              const newPassword = document.getElementById('reset-password').value;
              const confirmPassword = document.getElementById('reset-confirm-password').value;
              
              // Simple validation
              if (newPassword !== confirmPassword) {
                  alert('Passwords do not match!');
                  return;
              }
              
              // Here you would typically send the data to your server
              console.log('Password reset requested for:', email);
              console.log('New password:', newPassword);
              
              // Simulate successful reset
              setTimeout(function() {
                  // Redirect back to login page
                  window.location.href = '#sign-in-container';
                  
                  // Show success message (optional)
                  alert('Password reset successfully! You can now login with your new password.');
              }, 1000);
          });
      }
  }
  
  // Close modal handler
  function setupCloseModal() {
      const closeLinks = document.querySelectorAll('.close-modal');
      
      closeLinks.forEach(link => {
          link.addEventListener('click', function(e) {
              e.preventDefault();
              window.location.href = '#sign-in-container';
          });
      });
  }
  
  // Initialize all functionality
  setupEyeIcons();
  setupFormSubmission();
  setupCloseModal();
});