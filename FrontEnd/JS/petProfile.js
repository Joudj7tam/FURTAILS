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

document.addEventListener('DOMContentLoaded', async function () {
    // ===== 1. Handle Back Button =====
    const backButton = document.querySelector('.back');
  
    function setBackLink() {
      const referrer = document.referrer;
      let backLink = '../HTML/HomePage.html';
      
      if (referrer.includes('userProfile.html')) {
        backLink = '../HTML/userProfile.html';
      } else if (referrer.includes('HomePage.html') || referrer === '') {
        backLink = '../HTML/HomePage.html';
      }
      
      if (backButton) {
        backButton.href = backLink;
        backButton.addEventListener('click', function (e) {
          console.log('Navigating back to:', this.href);
        });
      }
    }
  
    setBackLink(); // ✅ Set the back link when page loads
  
    // ===== 2. Fetch Pet Info =====
    const urlParams = new URLSearchParams(window.location.search);
    const petId = urlParams.get('id');  // Declare petId early
  
    if (!petId) {
      alert('No pet selected!');
      return;
    }
  
    const petPic = document.getElementById('petPic');
    const petName = document.getElementById('petName');
    const petSex = document.getElementById('petSex');
    const petBirthDate = document.getElementById('petBirthDate');
    const petBreed = document.getElementById('petBreed');
    const petHealthProblem = document.getElementById('petHealthProblem');
  
    try {
      const response = await fetch(`http://localhost:5000/api/pets/${petId}`);
      const result = await response.json();
  
      if (result.success) {
        const pet = result.data;
  
        if (petPic) petPic.src = `http://localhost:5000/uploads/${pet.petPhoto}`;
        if (petName) petName.value = pet.name;
        if (petSex) petSex.value = pet.sex;
        if (petBirthDate && pet.birthDate) {
          petBirthDate.value = pet.birthDate.split('T')[0];
        }
        if (petBreed) petBreed.value = pet.breed;
        if (petHealthProblem) {
          petHealthProblem.value = pet.healthProblem || "None";
        }
        
      } else {
        alert('Pet not found!');
      }
    } catch (error) {
      console.error('Error fetching pet:', error);
      alert('Failed to fetch pet info.');
    }
  
    // ===== 3. Handle Save Changes Button =====
    const editButton = document.getElementById('editButton');
  
    if (editButton) {
      editButton.addEventListener('click', async () => {
        const updatedName = petName.value.trim();
        const updatedSex = petSex.value;
        const updatedBirthDate = petBirthDate.value;
        const updatedBreed = petBreed.value.trim();
        const updatedHealthProblem = petHealthProblem.value;
        const ownerEmail = localStorage.getItem('email'); // 👈 get the logged-in user
  
        if (!ownerEmail) {
          alert("No user logged in. Cannot update pet.");
          return;
        }
  
        try {
          const response = await fetch(`http://localhost:5000/api/pets/${petId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              name: updatedName,
              sex: updatedSex,
              birthDate: updatedBirthDate,
              breed: updatedBreed,
              healthProblem: updatedHealthProblem,
              owner: ownerEmail
            })
          });
  
          const result = await response.json();
  
          if (result.success) {
            alert('Pet information updated successfully!');
            console.log('Updated Pet:', result.data);
            // Optional: Update the page if needed
          } else {
            alert('Failed to update pet: ' + result.message);
          }
        } catch (error) {
          console.error('Error updating pet:', error);
          alert('An error occurred while updating pet.');
        }
      });
    }
  });
  