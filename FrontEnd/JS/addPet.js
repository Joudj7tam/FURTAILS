document.addEventListener('DOMContentLoaded', () => {
    const petList = document.getElementById('petList');
    const addPetForm = document.querySelector('#add-pet-popup form');
    const ownerId = localStorage.getItem('userId');
  
    // ✅ Load pets when the page loads
    async function loadPets() {
      if (!ownerId || !petList) return;
  
      try {
        const response = await fetch(`http://localhost:5000/api/pets/user/${ownerId}`);
        const result = await response.json();
  
        if (result.success && Array.isArray(result.data)) {
          // ✅ Save and re-add the Add Pet button
          const addBtn = petList.querySelector('.add-pet-container');
          petList.innerHTML = '';
          if (addBtn) petList.appendChild(addBtn);
  
          result.data.forEach(pet => {
            const petCard = document.createElement('a');
            petCard.className = 'pet-link';
            petCard.href = '../../FrontEnd/HTML/petProfile.html';
  
            petCard.innerHTML = ` 
           <div class="pet-image-wrapper">
              <img src="http://localhost:5000/uploads/${pet.petPhoto}" alt="${pet.name}">
              <span class="pet-name-badge">${pet.name}</span>
          </div>`;          
            petList.insertBefore(petCard, petList.querySelector('.add-pet-container'));
          });
        } else {
          petList.innerHTML = '<p>No pets added yet.</p>';
        }
      } catch (err) {
        console.error("Failed to load pets:", err);
        petList.innerHTML = '<p>Error loading pets.</p>';
      }
    }
  
    // ✅ Handle adding new pet
    if (addPetForm) {
      addPetForm.addEventListener('submit', async (e) => {
        e.preventDefault();
  
        const formData = new FormData(addPetForm);
  
        const birthDateValue = document.getElementById('petBirth').value;
        const birthDate = new Date(birthDateValue);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
  
        formData.append('age', age);
  
        if (!ownerId) {
          alert("You're not logged in. Please log in to add a pet.");
          return;
        }
  
        formData.append('owner', ownerId);
  
        try {
          const response = await fetch('http://localhost:5000/api/pets/add', {
            method: 'POST',
            body: formData
          });
  
          const result = await response.json();
  
          if (result.success) {
            alert("Pet added successfully!");
            addPetForm.reset(); // Clear form
            loadPets(); // Refresh list without reloading the page
          } else {
            alert("Failed to add pet: " + result.message);
          }
        } catch (error) {
          console.error("Error:", error);
          alert("An error occurred while adding the pet.");
        }
      });
    }
  
    // ✅ Initial load
    loadPets();
  });
  