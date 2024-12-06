// Import Firebase Realtime Database
import { getDatabase, ref, push, set } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { database } from "./config/firebase-config.js"; // Import Firebase Config

// Add event listener for form submission
// Ensure the script runs after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    const contactForm = document.getElementById("contact-form");

    if (!contactForm) {
        console.error("Contact form element not found in the DOM.");
        return;
    }

    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevent default form submission

        // Collect form data
        const formData = {
            firstName: document.getElementById("firstName").value,
            lastName: document.getElementById("lastName").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value,
            reason: document.getElementById("reason").value,
            message: document.getElementById("message").value,
            submittedAt: new Date().toISOString(), // Timestamp
        };

        try {
            // Reference the "contacts" node in your Firebase Realtime Database
            const contactRef = push(ref(database, "contacts"));

            // Store the form data in Firebase
            await set(contactRef, formData);

            // Show success message
            const responseMessage = document.getElementById("response-message");
            responseMessage.textContent = "Thank you! Your message has been submitted successfully.";
            responseMessage.style.color = "green";
            contactForm.reset(); // Reset form after successful submission
        } catch (error) {
            console.error("Error submitting the form:", error);

            // Show error message
            const responseMessage = document.getElementById("response-message");
            responseMessage.textContent = "Something went wrong. Please try again.";
            responseMessage.style.color = "red";
        }
    });
});
