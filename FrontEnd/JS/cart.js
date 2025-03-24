// Get the modal and the button
const completeOrderModal = document.getElementById('completeOrderModal');
const proceedToCheckoutButton = document.querySelector('.cart-totals-actions button');

// Function to open the modal
function openModal() {
    completeOrderModal.style.display = 'block';
}

// Function to close the modal
function closeModal() {
    completeOrderModal.style.display = 'none';
}

// Event listener for the "PROCEED TO CHECKOUT" button
proceedToCheckoutButton.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent form submission (if applicable)
    openModal();
});

// Close the modal when clicking outside of it
window.addEventListener('click', (event) => {
    if (event.target === completeOrderModal) {
        closeModal();
    }
});