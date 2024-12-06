import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js"; // Import Firebase Database
import { database } from "./config/firebase-config.js"; // Import Firebase Config

// Function to fetch menu items from Firebase
async function fetchMenuItems() {
    try {
        const db = getDatabase(); // Use the initialized Firebase app instance
        const foodsRef = ref(db, "foods"); // Reference to the food data in Firebase Realtime Database

        // Get category from URL query params
        const urlParams = new URLSearchParams(window.location.search);
        const categoryFilter = urlParams.get('category'); // Get the category from the query string
        console.log('Category Filter:', categoryFilter);  // Log the filter value

        // Fetch the data from Firebase
        const snapshot = await get(foodsRef);
        if (snapshot.exists()) {
            let foods = snapshot.val();
            console.log("Fetched foods:", foods); // Log the fetched data to check its structure

            // Filter by category if a category is selected
            if (categoryFilter && categoryFilter !== 'All') {
                foods = Object.values(foods).filter(food => food.category === categoryFilter);
                console.log("Filtered foods:", foods); // Log the filtered foods
            } else {
                foods = Object.values(foods); // Show all foods if no category or "All" is selected
            }

            renderMenuItems(foods); // Pass the filtered foods to the render function
        } else {
            console.log("No data available");
        }
    } catch (error) {
        console.error("Error fetching menu items:", error);
    }
}

// Function to render menu items dynamically
function renderMenuItems(foods) {
    const menuItemsContainer = document.getElementById('menu-items-container');
    menuItemsContainer.innerHTML = ''; // Clear any existing items before rendering

    // Convert the foods object to an array of menu items
    const foodArray = Object.values(foods);

    console.log('Menu items:', foodArray); // Log the menu items to verify the data structure

    // Loop through the foodArray and display each item
    foodArray.forEach(food => {
        console.log(food);  // Log the food object to check if the properties are present

        const foodItem = document.createElement('div');
        foodItem.classList.add('bg-white', 'rounded-xl', 'shadow-lg', 'overflow-hidden', 'hover:shadow-xl', 'transition-shadow');

        foodItem.innerHTML = `
    <div class="relative">
        <img src="${food.imagePath || 'default-image.jpg'}" alt="${food.name || 'Unknown Food'}" class="w-full h-48 object-cover" />
        ${food.isBestSeller ? `<span class="absolute top-4 right-4 bg-orange-500 text-white px-2 py-1 rounded-lg font-['Poppins'] text-sm">Best Seller</span>` : ''}
    </div>
    <div class="p-6">
        <div class="flex justify-between items-center mb-4">
            <h3 class="font-['Playfair_Display'] text-xl font-bold text-gray-800">${food.name}</h3>
            <div class="flex items-center gap-2">
                <span class="text-orange-500 font-['Poppins'] font-bold">₹${food.price}</span>
                ${food.originalPrice && food.originalPrice > food.price ? 
                    `<span class="text-gray-400 text-sm line-through">₹${food.originalPrice}</span>` : ''}
            </div>
        </div>
        <p class="text-gray-600 text-sm mb-4 font-['Poppins']">${food.description}</p>
    </div>
`;


        menuItemsContainer.appendChild(foodItem); // Append each food item to the container
    });
}

// Call fetchMenuItems when the page loads
document.addEventListener("DOMContentLoaded", fetchMenuItems);
