document.addEventListener('DOMContentLoaded', () => {
    const petList = document.getElementById('petList');
    const addPetForm = document.querySelector('#add-pet-popup form');
    const userEmail  = localStorage.getItem('email');
  
    // ✅ Load pets when the page loads
    async function loadPets() {
      if (!userEmail  || !petList) return;
     
      try {
        const response = await fetch(`http://localhost:5000/api/pets/user/${userEmail}`);
        const result = await response.json();
  
        if (result.success && Array.isArray(result.data)) {
          // ✅ Save and re-add the Add Pet button
          const addBtn = petList.querySelector('.add-pet-container');
          petList.innerHTML = '';
          if (addBtn) petList.appendChild(addBtn);
  
          result.data.forEach(pet => {
            const petCard = document.createElement('a');
            petCard.className = 'pet-link';
            petCard.href = `../../FrontEnd/HTML/petProfile.html?id=${pet._id}`;
  
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
        const healthProblem = document.getElementById('disease').value;
        formData.append('healthProblem', healthProblem);
        
        const birthDateValue = document.getElementById('petBirth').value;
        const birthDate = new Date(birthDateValue);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
  
        formData.append('age', age);
  
        if (!userEmail) {
          alert("You're not logged in. Please log in to add a pet.");
          return;
        }
  
        formData.append('userEmail', userEmail);
  
        try {
          const response = await fetch('http://localhost:5000/api/pets/add', {
            method: 'POST',
            body: formData
          });
  
          const result = await response.json();
  
          if (result.success) {
            // Add pet name to user profile
            const addToUserResponse = await fetch('http://localhost:5000/api/users/addPet', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                petName: formData.get('name'), // Get pet name from form
                userEmail: userEmail
              })
            });
        
            const userResult = await addToUserResponse.json();
            
            if (!userResult.success) {
              console.error("Failed to add pet to user profile:", userResult.message);
            }
        
            alert("Pet added successfully!");
            addPetForm.reset();
            loadPets();
          } else {
            alert("Failed to add pet to the user profile: " + result.message);
          }

        } catch (error) {
          console.error("Error:", error);
          alert("Pet added successfully!");
        }
      });
    }
  
    // ✅ Initial load
    loadPets();
  });
  