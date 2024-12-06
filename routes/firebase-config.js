// firebase-config.js

// Import the necessary Firebase modules
const { initializeApp } = require("firebase/app");
const { getDatabase } = require("firebase/database");
const { getStorage } = require("firebase/storage");

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

// Get Firebase services
const database = getDatabase(app);
const storage = getStorage(app);

// Export the database and storage services
module.exports = { database, storage };