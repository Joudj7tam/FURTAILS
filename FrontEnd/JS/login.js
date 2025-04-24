const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

// Add these right after your initial variable declarations
function displayError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (!errorElement) {
        // Try different variations to find the input element
        let inputElement = document.getElementById(elementId.replace('-error', ''));
        if (!inputElement) {
            inputElement = document.getElementById(elementId.replace('-error', '-input'));
        }
        if (!inputElement) {
            // Special case for reset password form
            if (elementId === 'reset-confirm-error') {
                inputElement = document.getElementById('reset-confirm-password');
            }
        }
        
        if (inputElement) {
            const errorDiv = document.createElement('div');
            errorDiv.id = elementId;
            errorDiv.className = 'error-message';
            errorDiv.textContent = message;
            // Insert after the input element
            inputElement.parentNode.insertBefore(errorDiv, inputElement.nextSibling);
        }
    } else {
        errorElement.textContent = message;
    }
}

function clearError(elementId) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = '';
    }
}

///////toggle between forms//////////////////////////////////////////////
registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});
///////END toggle between forms//////////////////////////////////////////////

//////////toggle password visibility and switch icons///////////////////////////////
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
document.getElementById('signup-eye').addEventListener('click', function () {
    const passwordField = document.getElementById('signup-password-input');
    togglePasswordVisibility(passwordField, this);
});

document.getElementById('signup-confirm-eye').addEventListener('click', function () {
    const passwordField = document.getElementById('signup-confirm-input');
    togglePasswordVisibility(passwordField, this);
});

// Add event listeners for the eye icons in the Sign In form
document.getElementById('signin-eye').addEventListener('click', function () {
    const passwordField = document.getElementById('signin-password-input');
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
////////// END toggle password visibility and switch icons///////////////////////////////

// Initialize - show sign in by default
signInForm.classList.add('active');


////////////input validation and fetching for signUp////////////////////////////////////////////////////////
document.getElementById('signupForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    // Get form values
    const email = document.getElementById('signup-email-input').value;
    const phoneNum = document.getElementById('signup-phone-input').value;
    const password = document.getElementById('signup-password-input').value;
    const confirmPassword = document.getElementById('signup-confirm-input').value;

    // Clear previous errors
    clearError('signup-email-error');
    clearError('signup-phone-error');
    clearError('signup-password-error');
    clearError('signup-confirm-error');

    // Frontend validation (matches backend validation)
    let isValid = true;

    // Email validation
    if (!email) {
        displayError('signup-email-error', 'Email is required');
        isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        displayError('signup-email-error', 'Please enter a valid email');
        isValid = false;
    }

    // Phone number validation
    if (!phoneNum) {
        displayError('signup-phone-error', 'Phone number is required');
        isValid = false;
    } else if (!/^05\d{8}$/.test(phoneNum)) {
        displayError('signup-phone-error', 'Phone number must be 10 digits starting with 05');
        isValid = false;
    }

    // Password validation
    if (!password) {
        displayError('signup-password-error', 'Password is required');
        isValid = false;
    } else if (password.length < 8) {
        displayError('signup-password-error', 'Please enter a strong password (at least 8 characters)');
        isValid = false;
    }

    // Confirm password validation
    if (password !== confirmPassword) {
        displayError('signup-confirm-error', 'Passwords do not match');
        isValid = false;
    }

    if (!isValid) {
        return; // Stop if validation fails
    }

    try {
        // Show loading state (optional)
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Creating Account...';

        // Send data to server
        const response = await fetch('http://localhost:5000/api/login/signUp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                phoneNum,
                password
            }),
        });

        const data = await response.json();

        if (data.success) {
            // Store email in localStorage
            localStorage.setItem('email', email);
            // Successful sign up - redirect to home page
            window.location.href = "../HTML/HomePage.html";
        } else {
            // Display error message from server
            if (data.message === "User already exists") {
                displayError('signup-email-error', data.message);
            } else {
                // For other errors, show a general error message
                displayError('signup-general-error', data.message || "Error occurred during sign up");
            }
        }
    } catch (error) {
        console.error('Error:', error);
        displayError('signup-general-error', "An error occurred. Please try again.");
    } finally {
        // Reset button state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Sign Up';
        }
    }
});

// Real-time validation for better UX
document.getElementById('signup-email-input').addEventListener('input', function () {
    clearError('signup-email-error');
});

document.getElementById('signup-phone-input').addEventListener('input', function () {
    clearError('signup-phone-error');
    // Automatically format phone number as user types
    const phoneInput = this;
    const phoneValue = phoneInput.value.replace(/\D/g, '');
    if (phoneValue.length > 0 && !phoneValue.startsWith('05')) {
        phoneInput.value = '05' + phoneValue.substring(2, 10);
    } else {
        phoneInput.value = phoneValue.substring(0, 10);
    }
});

document.getElementById('signup-password-input').addEventListener('input', function () {
    clearError('signup-password-error');
    clearError('signup-confirm-error');
});

document.getElementById('signup-confirm-input').addEventListener('input', function () {
    clearError('signup-confirm-error');
});
////////////END input validation and fetching for signUp////////////////////////////////////////////////////////

//////////// Sign In Form Validation and Fetching ////////////////////////////////////////////////////////
document.getElementById('signinForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    // Get form values
    const email = document.getElementById('signin-email-input').value;
    const password = document.getElementById('signin-password-input').value;

    // Clear previous errors
    clearError('signin-email-error');
    clearError('signin-password-error');

    // Frontend validation (matches backend validation)
    let isValid = true;

    // Email validation
    if (!email) {
        displayError('signin-email-error', 'Email is required');
        isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        displayError('signin-email-error', 'Please enter a valid email');
        isValid = false;
    }

    // Password validation
    if (!password) {
        displayError('signin-password-error', 'Password is required');
        isValid = false;
    }

    if (!isValid) {
        return; // Stop if validation fails
    }

    try {
        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Signing In...';

        // Send data to server
        const response = await fetch('http://localhost:5000/api/login/signIn', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password
            }),
        });

        const data = await response.json();

        if (data.success && data.user )  {
            // Store email in localStorage
             localStorage.setItem('email', email);
             localStorage.setItem('userId', data.user._id); 
            // Successful sign in - redirect to home page
            window.location.href = "../HTML/HomePage.html";
        } else {
            // Display error message from server
            if (data.message === "User doesn't exist") {
                displayError('signin-email-error', data.message);
            } else if (data.message === "Invalid password") {
                displayError('signin-password-error', data.message);
            } else {
                // For other errors, show a general error message
                const generalError = document.getElementById('signin-general-error') || createErrorElement('signin-general-error');
                generalError.textContent = data.message || "Error occurred during sign in";
            }
        }
    } catch (error) {
        console.error('Error:', error);
        const generalError = document.getElementById('signin-general-error') || createErrorElement('signin-general-error');
        generalError.textContent = "An error occurred. Please try again.";
    } finally {
        // Reset button state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Sign In';
        }
    }
});

// Helper function to create error element if it doesn't exist
function createErrorElement(elementId) {
    const form = document.getElementById('signinForm');
    const errorDiv = document.createElement('div');
    errorDiv.id = elementId;
    errorDiv.className = 'error-message';
    form.insertBefore(errorDiv, form.lastElementChild);
    return errorDiv;
}

// Real-time validation for better UX
document.getElementById('signin-email-input').addEventListener('input', function () {
    clearError('signin-email-error');
});

document.getElementById('signin-password-input').addEventListener('input', function () {
    clearError('signin-password-error');
});
//////////// END Sign In Form Validation and Fetching ////////////////////////////////////////////////////////

//////////// Reset Password Form Validation and Fetching ////////////////////////////////////////////////////////
document.getElementById('resetPasswordForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    // Get form values
    const email = document.getElementById('reset-email-input').value;
    const newPassword = document.getElementById('reset-password').value;
    const confirmPassword = document.getElementById('reset-confirm-password').value;

    // Clear previous errors
    clearError('reset-email-error');
    clearError('reset-password-error');
    clearError('reset-confirm-error');
    clearError('reset-general-error');

    // Frontend validation (matches backend validation)
    let isValid = true;

    // Email validation
    if (!email) {
        displayError('reset-email-error', 'Email is required');
        isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        displayError('reset-email-error', 'Please enter a valid email');
        isValid = false;
    }

    // Password validation
    if (!newPassword) {
        displayError('reset-password-error', 'Password is required');
        isValid = false;
    } else if (newPassword.length < 8) {
        displayError('reset-password-error', 'Password must be at least 8 characters');
        isValid = false;
    }

    // Confirm password validation
    if (newPassword !== confirmPassword) {
        displayError('reset-confirm-error', 'Passwords do not match');
        isValid = false;
    }

    if (!isValid) {
        return; // Stop if validation fails
    }

    try {
        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Resetting Password...';

        // Send data to server
        const response = await fetch('http://localhost:5000/api/login/resetPassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                newPassword,
                confirmPassword
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to reset password');
        }

        if (data.success) {
            // Only show success and redirect if the server confirms success
            alert(data.message || "Password reset successfully!");
            window.location.href = '#sign-in-container';
        } else {
            // Display error message from server
            if (data.message === "User not found") {
                displayError('reset-email-error', data.message);
            } else {
                // For other errors, show a general error message
                const generalError = document.getElementById('reset-general-error') || createResetErrorElement('reset-general-error');
                generalError.textContent = data.message || "Error occurred during password reset";
            }
        }
    } catch (error) {
        console.error('Error:', error);
        const generalError = document.getElementById('reset-general-error') || createResetErrorElement('reset-general-error');
        generalError.textContent = error.message || "An error occurred. Please try again.";
    } finally {
        // Reset button state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Reset Password';
        }
    }
});
//////////// END Reset Password Form Validation and Fetching ////////////////////////////////////////////////////////

document.addEventListener('DOMContentLoaded', function () {

    //////////toggle password visibility and switch icons for "POPUP"///////////////////////////////
    // Password visibility toggle for all eye icons
    function setupEyeIcons() {
        // Reset password eye icons
        const resetEye = document.getElementById('reset-eye');
        const resetConfirmEye = document.getElementById('reset-confirm-eye');
        const resetPassword = document.getElementById('reset-password');
        const resetConfirmPassword = document.getElementById('reset-confirm-password');

        if (resetEye && resetPassword) {
            resetEye.addEventListener('click', function () {
                togglePasswordVisibility(resetPassword, resetEye);
            });
        }

        if (resetConfirmEye && resetConfirmPassword) {
            resetConfirmEye.addEventListener('click', function () {
                togglePasswordVisibility(resetConfirmPassword, resetConfirmEye);
            });
        }

        // Existing form eye icons (if needed)
        const signupEye = document.getElementById('signup-eye');
        const signupPassword = document.getElementById('signup-password');

        if (signupEye && signupPassword) {
            signupEye.addEventListener('click', function () {
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
    ////////// END toggle password visibility and switch icons for "POPUP"///////////////////////////////

    ///////////////reset password////////////////////////////////////////////////////////////////////////
    // Close modal handler
    function setupCloseModal() {
        const closeLinks = document.querySelectorAll('.close-modal');

        closeLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                window.location.href = '#sign-in-container';
            });
        });
    }
    ///////////////reset password////////////////////////////////////////////////////////////////////////


    // Initialize all functionality
    setupEyeIcons();
    setupCloseModal();
});