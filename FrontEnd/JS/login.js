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