// firebase-config.js

// Import the necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// Your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyAOUZSQBUveeWuvLXU1yfkr2jlMW_Tom_g",
  authDomain: "shubh-sagar.firebaseapp.com",
  databaseURL: "https://shubh-sagar-default-rtdb.firebaseio.com",
  projectId: "shubh-sagar",
  storageBucket: "shubh-sagar.firebasestorage.app",
  messagingSenderId: "612942629716",
  appId: "1:612942629716:web:e04d9637bf7c7a171d16c1",
  measurementId: "G-ZKFESBC2ES"
};

// Initialize Firebase with the provided config
const app = initializeApp(firebaseConfig);

// Get the Firebase Realtime Database instance
const database = getDatabase(app);

// Export the database for use in other files
export { database };
