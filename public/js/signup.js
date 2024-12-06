import { getDatabase, ref, push, set, query, orderByChild, equalTo, get } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js"; // Import necessary functions
import { database } from "./config/firebase-config.js"; // Import your Firebase config

const signupForm = document.querySelector("form");

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Get form values
  const fullName = document.getElementById("signup-name").value.trim();
  const phone = document.getElementById("signup-phone").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value.trim();
  const confirmPassword = document.getElementById("signup-confirm-password").value.trim();
  const termsAccepted = document.getElementById("terms").checked;

  // Validate inputs
  if (!fullName || !phone || !email || !password || !confirmPassword) {
    alert("All fields are required.");
    return;
  }

  if (!/^\d{10}$/.test(phone)) {
    alert("Invalid phone number. Must be 10 digits.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  if (!termsAccepted) {
    alert("You must accept the terms and conditions.");
    return;
  }

  try {
    // Check if the email or phone already exists in the database
    const db = getDatabase();
    const usersRef = ref(db, 'users');
    
    // Check for existing email
    const emailQuery = query(usersRef, orderByChild('email'), equalTo(email));
    const emailSnapshot = await get(emailQuery);
    
    if (emailSnapshot.exists()) {
      alert("Email already exists. Please try with a different email.");
      return;
    }

    // Check for existing phone number
    const phoneQuery = query(usersRef, orderByChild('phone'), equalTo(phone));
    const phoneSnapshot = await get(phoneQuery);
    
    if (phoneSnapshot.exists()) {
      alert("Phone number already exists. Please try with a different number.");
      return;
    }

    // Create new user reference and push data to the database
    const newUserRef = push(usersRef);
    await set(newUserRef, {
      fullName,
      phone,
      email,
      password,
      createdAt: new Date().toISOString(),
    });

    alert("Account created successfully!");
    signupForm.reset();

    // Redirect to the sign-in page
    window.location.href = "/login"; // Assuming login page is at /login

  } catch (error) {
    console.error("Error saving data:", error);
    alert("Failed to create account. Please try again later.");
  }
});
