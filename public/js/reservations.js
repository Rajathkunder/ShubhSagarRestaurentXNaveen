import { database } from "./config/firebase-config.js";
import { ref, get, update } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// Fetch data from Firebase
// Fetch data from Firebase
async function fetchReservations() {
    const reservationsRef = ref(database, 'reservations');
    const snapshot = await get(reservationsRef);
    const reservations = snapshot.val();
    console.log(reservations);
  
    const reservationContainer = document.querySelector('.space-y-24');
    reservationContainer.innerHTML = ''; // Clear existing content
  
    // Loop through each reservation and display only available ones
    for (const [id, table] of Object.entries(reservations)) {
      if (table.status !== 'available') continue; // Only display available tables
  
      const tableElement = document.createElement('div');
      tableElement.classList.add('flex', 'flex-col', 'lg:flex-row', 'items-center', 'gap-12', 'bg-white', 'rounded-2xl', 'shadow-xl', 'overflow-hidden');
  
      // Updated layout: image on the left, content on the right
      tableElement.innerHTML = `
        <div class="w-full lg:w-1/2 p-8 lg:p-12">
          <img src="${table.imagePath || 'default-image.jpg'}" alt="${table.Name}" class="w-full h-56 object-cover rounded-lg mb-6 lg:mb-0 lg:mr-8">
        </div>
        <div class="w-full lg:w-1/2 p-8 lg:p-12">
          <div class="max-w-xl">
            <h4 class="text-3xl font-bold">${table.Name}</h4>
            <div class="flex gap-4 mb-6">
              <span class="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">${table.numOfPeople} people</span>
              <span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">${table.status === 'available' ? 'Available' : 'Reserved'}</span>
            </div>
            <p class="text-gray-600 mb-8 leading-relaxed">${table.reservationDescription}</p>
            <button 
              class="reserve-btn inline-flex items-center gap-2 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors"
              ${table.status === 'reserved' ? 'disabled' : ''}>
              <span>${table.status === 'available' ? 'Reserve This Table' : 'Reserved'}</span>
              <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
              </svg>
            </button>
          </div>
        </div>
      `;
      
      // Attach the event listener to the button
      const button = tableElement.querySelector('.reserve-btn');
      button.addEventListener('click', () => reserveTable(id));
  
      reservationContainer.appendChild(tableElement);
    }
  }
  

// Reserve a table
// Reserve a table
async function reserveTable(tableId) {
    // Get the email from the URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const userEmail = urlParams.get('email');
  
    // Check if the email exists in the URL
    if (!userEmail) {
      alert("Please log in to reserve a table.");
      return;
    }
  
    const reservationRef = ref(database, `reservations/${tableId}`);
    
    // Update the table status to 'reserved'
    await update(reservationRef, { status: 'reserved', reservedBy: userEmail });
  
    // Simple alert message for successful reservation
    alert("Your table has been reserved!");
  
    // Re-fetch and update the page after the reservation
    fetchReservations();
  }
  
// Call the fetch function when the page loads
document.addEventListener('DOMContentLoaded', fetchReservations);
