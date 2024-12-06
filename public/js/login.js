import { getDatabase, ref, query, orderByChild, equalTo, get } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js"; // Import Firebase Database
import { database } from "./config/firebase-config.js"; // Import Firebase Config

const loginForm = document.querySelector("form");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Get form values
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  // Validate inputs
  if (!email || !password) {
    alert("Both fields are required.");
    return;
  }

  try {
    // Check if the credentials match the admin login
    if (email === "admin@gmail.com" && password === "admin123") {
      // If the email and password match the admin credentials, redirect to the admin dashboard
      alert("Welcome, Admin!");
      window.location.href = "/admin/dashboard"; // Admin dashboard route
      return; // Stop further execution if admin credentials are matched
    }

    // Get a reference to the users node in the database
    const db = getDatabase();
    const usersRef = ref(db, "users");

    // Query to find the user with the given email
    const emailQuery = query(usersRef, orderByChild("email"), equalTo(email));
    const snapshot = await get(emailQuery);

    if (snapshot.exists()) {
      const users = snapshot.val();
      const user = Object.values(users)[0]; // Get the first matching user

      // Validate the password for the regular user
      if (user.password === password) {
        alert(`Welcome back, ${user.fullName}!`);
        const homeUrl = `/?email=${encodeURIComponent(user.email)}&name=${encodeURIComponent(user.fullName)}`;
        window.location.href = homeUrl; // Redirect to the user home page
      } else {
        alert("Incorrect password. Please try again.");
      }
    } else {
      alert("No user found with this email. Please sign up first.");
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("Failed to log in. Please try again later.");
  }
});
