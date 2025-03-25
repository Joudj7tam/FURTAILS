/*document.getElementById("editButton").addEventListener("click", function () {
    toggleEditMode();
});

function toggleEditMode() {
    const editableFields = document.querySelectorAll(".editable-field");
    const editButton = document.getElementById("editButton");

    editableFields.forEach(field => {
        if (field.tagName === "INPUT" || field.tagName === "SELECT") {
            if (field.readOnly || field.disabled) {
                field.readOnly = false;
                field.disabled = false;
                field.classList.add("editable");
            } else {
                field.readOnly = true;
                field.disabled = true;
                field.classList.remove("editable");
            }
        }
    });

    if (editButton.textContent.includes("Edit")) {
        editButton.innerHTML = '<i class="fas fa-save"></i> Save';
    } else {
        editButton.innerHTML = '<i class="fas fa-edit"></i> Edit';
        alert("Changes saved!"); // Optional: Notify user that changes are saved
    }
}*/

// petProfile.js

document.addEventListener('DOMContentLoaded', function() {
    // Get the back button/link element
    const backButton = document.querySelector('.back');
    
    // Function to determine and set the correct back link
    function setBackLink() {
        // Check document.referrer to see where we came from
        const referrer = document.referrer;
        const petProfileUrl = window.location.href;
        
        // Default back link is HomePage.html
        let backLink = '../HTML/HomePage.html';
        
        // Check if we came from userProfile.html
        if (referrer.includes('userProfile.html')) {
            backLink = '../HTML/userProfile.html';
        }
        // If we came from HomePage.html or no referrer (direct access), use HomePage
        else if (referrer.includes('HomePage.html') || referrer === '') {
            backLink = '../HTML/HomePage.html';
        }
        
        // Set the href attribute of the back button
        backButton.href = backLink;
    }
    
    // Call the function when page loads
    setBackLink();
    
    // Optional: Add click handler for additional functionality
    backButton.addEventListener('click', function(e) {
        // You could add analytics tracking here if needed
        console.log('Navigating back to:', this.href);
        
        // The default link behavior will handle the navigation
    });
});