document.getElementById("editButton").addEventListener("click", function () {
    toggleEditMode();
});

function toggleEditMode() {
    const editableFields = document.querySelectorAll(".editable-field");
    const editButton = document.getElementById("editButton");

    editableFields.forEach(field => {
        if (field.contentEditable === "true") {
            field.contentEditable = "false";
            field.classList.remove("editable");
        } else {
            field.contentEditable = "true";
            field.classList.add("editable");
        }
    });
    
    if (editButton.textContent.includes("Edit")) {
        editButton.innerHTML = '<i class="fas fa-save"></i> Save';
    } else {
        editButton.innerHTML = '<i class="fas fa-edit"></i> Edit';
        alert("Changes saved!"); // Optional: Notify user that changes are saved
    }
}

// Get the modal and close button
const modal = document.getElementById("orderInfoModal");
const closeModal = document.getElementById("closeModal");

// Get all info buttons
const infoButtons = document.querySelectorAll(".order-info img");

// Function to open the modal and populate data
function openModal(order) {
    // Populate the modal with order data
    document.getElementById("receiptPetName").textContent = document.getElementById("petName").textContent;
    document.getElementById("receiptOrderNumber").textContent = order.querySelector(".order-number").textContent;
    document.getElementById("receiptOrderDate").textContent = order.querySelector(".order-date").textContent;
    document.getElementById("receiptOrderStatus").textContent = order.querySelector(".order-status").textContent;

    // Example services and prices (replace with dynamic data if available)
    const services = [
        { name: "Feeding", price: 20.00 },
        { name: "Grooming", price: 30.00 },
    ];

    const servicesList = document.getElementById("receiptServices");
    servicesList.innerHTML = ""; // Clear previous content

    let totalPrice = 0;
    services.forEach(service => {
        const li = document.createElement("li");
        li.innerHTML = `<span>${service.name}</span><span>$${service.price.toFixed(2)}</span>`;
        servicesList.appendChild(li);
        totalPrice += service.price;
    });

    document.getElementById("receiptTotalPrice").textContent = totalPrice.toFixed(2);

    // Display the modal
    modal.style.display = "block";
}

// Add click event listeners to all info buttons
infoButtons.forEach(button => {
    button.addEventListener("click", () => {
        const order = button.closest(".order");
        openModal(order);
    });
});

// Close the modal when the close button is clicked
closeModal.addEventListener("click", () => {
    modal.style.display = "none";
});

// Close the modal when clicking outside of it
window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});