
// petProfile.js

document.addEventListener('DOMContentLoaded', async function () {
    // ===== 1. Handle Back Button =====
    const backButton = document.querySelector('.back');
  
    function setBackLink() {
      const referrer = document.referrer;
      let backLink = '../HTML/HomePage.html';
      
      if (referrer.includes('userProfile.html')) {
        backLink = '../HTML/userProfile.html';
      } 
      
      if (backButton) {
        const backAnchor = backButton.closest('a');
        if (backAnchor) {
            backAnchor.href = backLink;
          }
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
          petHealthProblem.value = pet.healthProblem ;
        }
        const currentPetName = pet.name; // ✅ Save pet name after fetching
        console.log("Fetched pet name:", currentPetName); // Optional debugging
        await fetchPetOrders(currentPetName);
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
  // ===== Helper to Fetch Pet Orders =====
  async function fetchPetOrders(petName) {
    const ordersContainer = document.querySelector('.orders-container');
  
    if (!ordersContainer) return;
  
    try {
      const response = await fetch('http://localhost:5000/api/order/list');
      const result = await response.json();
  
      if (result.success) {
        const allOrders = result.data;
  
        // Filter orders for the specific pet
        const petOrders = allOrders.filter(order => order.pet.toLowerCase() === petName.toLowerCase());
  
        // Find or create the order header (keep it)
        let orderHeader = ordersContainer.querySelector('.order-header');
        if (!orderHeader) {
          orderHeader = document.createElement('div');
          orderHeader.className = 'order-header';
          orderHeader.innerHTML = `
            <span>Number</span>
            <span>Date</span>
            <span>Status</span>
            <span>Info</span>
          `;
          ordersContainer.appendChild(orderHeader);
        }
  
        // Remove any previous order rows
        const previousOrders = ordersContainer.querySelectorAll('.order');
        previousOrders.forEach(order => order.remove());
  
        if (petOrders.length === 0) {
          // No orders: leave the header and optionally add a "no orders" message
          const noOrdersMsg = document.createElement('div');
          noOrdersMsg.className = 'no-orders-message';
          noOrdersMsg.style.padding = "10px";
          noOrdersMsg.innerHTML = `<p>No service history yet.</p>`;
          ordersContainer.appendChild(noOrdersMsg);
          return;
        }
  
        // If there are orders, add them
        petOrders.forEach((order, index) => {
          const orderDiv = document.createElement('div');
          orderDiv.classList.add('order');
  
          orderDiv.innerHTML = `
            <span class="order-number">${index + 1}</span>
            <span class="order-date">${new Date(order.date).toISOString().split('T')[0]}</span>
            <span class="order-status">Completed</span>
            <div class="show-info-popup">
              <a href="#orderInfoModal" onclick='showOrderInfo(${JSON.stringify(order)})'>
                <span class="order-info"><img src="../Media/info.png" alt="info"></span>
              </a>
            </div>
          `;
  
          ordersContainer.appendChild(orderDiv);
        });
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  }
  

// ===== Helper to Show Order Info in Modal =====
async function showOrderInfo(order) {
    document.getElementById('receiptPetName').textContent = order.pet;
    document.getElementById('receiptOrderNumber').textContent = order._id.substring(0, 6);
    document.getElementById('receiptOrderDate').textContent = new Date(order.date).toISOString().split('T')[0];
    document.getElementById('receiptOrderStatus').textContent = 'Completed';
    document.getElementById('receiptTotalPrice').textContent = `$${order.totalPrice.toFixed(2)}`;
  
    const receiptServices = document.getElementById('receiptServices');
    receiptServices.innerHTML = '';
  
    if (order.cartData && Array.isArray(order.cartData)) {
      for (const serviceId of order.cartData) {
        try {
          // 👇 Fetch service info by ID
          const serviceRes = await fetch(`http://localhost:5000/api/services/${serviceId}`);
          const serviceResult = await serviceRes.json();
  
          if (serviceResult.success) {
            const service = serviceResult.data;
            const li = document.createElement('li');
            li.innerHTML = `<span>${service.name}</span><span>$${service.price.toFixed(2)}</span>`;
            receiptServices.appendChild(li);
          } else {
            // In case service not found
            const li = document.createElement('li');
            li.innerHTML = `<span>Unknown Service</span>`;
            receiptServices.appendChild(li);
          }
        } catch (error) {
          console.error('Error fetching service:', error);
          const li = document.createElement('li');
          li.innerHTML = `<span>Service Fetch Error</span>`;
          receiptServices.appendChild(li);
        }
      }
    } else {
      const li = document.createElement('li');
      li.innerHTML = `<span>No Services Listed</span>`;
      receiptServices.appendChild(li);
    }
  }
  