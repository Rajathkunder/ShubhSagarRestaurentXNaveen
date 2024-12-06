import { database } from "./config/firebase-config.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// Fetch images from Firebase Realtime Database
async function fetchImages() {
  const imagesRef = ref(database, 'gallery'); // 'gallery' is the path in your Firebase Realtime Database
  const snapshot = await get(imagesRef);

  // If there are no images in the database, log a message
  if (!snapshot.exists()) {
    console.log('No images found in the database.');
    return;
  }

  const imagesData = snapshot.val();
  const galleryContainer = document.getElementById('image-gallery');

  // Loop through each image data and create HTML for each image
  Object.values(imagesData).forEach((imageObj) => {
    if (imageObj && imageObj.imagePath) {
      const imageUrl = imageObj.imagePath; // Assuming imagePath contains the URL

      const imageElement = document.createElement('div');
      imageElement.classList.add('p-2');

      const img = document.createElement('img');
      img.classList.add(
        'h-auto',
        'max-w-full',
        'rounded-lg',
        'motion-safe:transform',
        'motion-safe:translate-y-4',
        'motion-safe:opacity-0',
        'motion-safe:transition-all',
        'motion-safe:duration-1000',
        'hover:scale-110',
        'transition-all',
        'duration-300',
        'motion-safe:visible',
        'motion-safe:animate-fadeIn'
      );
      img.src = imageUrl;
      img.alt = "Gallery Image";

      imageElement.appendChild(img);
      galleryContainer.appendChild(imageElement);
    }
  });
}

// Call the fetchImages function when the page loads
window.onload = fetchImages;
