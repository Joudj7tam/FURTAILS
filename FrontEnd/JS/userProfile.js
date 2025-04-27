const email = localStorage.getItem("email");
async function fetchUserProfile() {
  try {
    const response = await fetch(`http://localhost:5000/api/users/me?email=${email}`);
    const result = await response.json();

    if (result.success) {
      const user = result.data;

      // Fill fields
      document.querySelector('input[name="user-name"]').value = user.email.split('@')[0];
      document.querySelector('input[name="user-pass"]').value = "********";
      document.querySelector('input[name="user-contactMethod"]').value = user.contactMethod || '';
      document.querySelector('input[name="user-date"]').value = user.memberSince ? new Date(user.memberSince).toISOString().split('T')[0] : '';

      document.querySelector('input[name="Full-Name"]').value = (user.firstName || '') + ' ' + (user.lastName || '');
      document.querySelector('input[name="user-email"]').value = user.email || '';
      document.querySelector('input[name="user-number"]').value = user.phoneNumber || '';
      document.querySelector('input[name="user-location"]').value = user.location || '';

      // Display pets count
      document.querySelector('#petsCount').textContent = `Pets Count: ${result.petsCount}`;
    } else {
      console.error('Failed to fetch profile:', result.message);
    }
  } catch (error) {
    console.error('Error fetching profile:', error);
  }
}


// Handle Save Changes
async function saveChanges() {
  // Get updated field values
  const fullNameInput = document.querySelector('input[name="Full-Name"]').value.trim();
  const [firstName, ...lastNameParts] = fullNameInput.split(' ');
  const lastName = lastNameParts.join(' ');
  
  const updatedData = {
    email: email, // email is fixed
    contactMethod: document.querySelector('input[name="user-contactMethod"]').value,
    phoneNumber: document.querySelector('input[name="user-number"]').value,
    firstName: firstName || '',
    lastName: lastName || '',
    location: document.querySelector('input[name="user-location"]').value,
  };
  

  try {
    const response = await fetch(`http://localhost:5000/api/users/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });

    const result = await response.json();

    if (result.success) {
      alert('Profile updated successfully!');
      fetchUserProfile(); // Refresh the fields after saving
    } else {
      console.error('Failed to update profile:', result.message);
      alert('Failed to update profile!');
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    alert('Error updating profile!');
  }
}

async function fetchUserPets() {
  try {
    const response = await fetch(`http://localhost:5000/api/users/pets?email=${email}`);
    const result = await response.json();

    if (result.success) {
      const pets = result.pets;
      const petSection = document.querySelector('.pet-cards'); // Make sure this matches your HTML section

      // Clear existing pet data (if any)
      petSection.innerHTML = ''; 

      pets.forEach(pet => {
        // Create a new pet card dynamically
        const petCard = document.createElement('div');
        petCard.classList.add('pet-card');
        
        petCard.innerHTML = `
          <h3>${pet.name}</h3>
          <p><strong>Type:</strong> ${pet.type}</p>
          <p><strong>Age:</strong> ${pet.age} years</p>
          <p><strong>Breed:</strong> ${pet.breed}</p>
          <a href="../HTML/petProfile.html?id=${pet._id}" class="pet-link">View Profile</a>
        `;
        
        // Append the new pet card to the pet section
        petSection.appendChild(petCard);
      });
    } else {
      console.error('Failed to fetch pets:', result.message);
    }
  } catch (error) {
    console.error('Error fetching pets:', error);
  }
}

// When page loads
document.addEventListener("DOMContentLoaded", () => {
  fetchUserProfile(); // Fetch user profile data
  fetchUserPets();    // Fetch pets associated with the user

  // Attach save button click
  document.querySelector('.save-btn').addEventListener('click', (e) => {
    e.preventDefault();
    saveChanges();
  });
});
