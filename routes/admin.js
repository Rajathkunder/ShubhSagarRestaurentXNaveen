const express = require("express");
const multer = require("multer");
const path = require("path");

const { database } = require("./firebase-config");
const {
  ref,
  push,
  set,
  remove,
  get,
  child,
  update,
} = require("firebase/database");

const adminRouter = express.Router();

// Multer configuration for storing images locally
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // e.g., 1632769817364.png
  },
});
const upload = multer({ storage });

// Function to fetch food item by ID from Firebase
async function getFoodById(foodId) {
  try {
    const dbRef = ref(database);
    const foodSnapshot = await get(child(dbRef, `foods/${foodId}`));

    if (foodSnapshot.exists()) {
      return foodSnapshot.val(); // Return the food item data
    } else {
      return null; // If the food item does not exist
    }
  } catch (error) {
    console.error("Error fetching food item:", error);
    return null; // Return null if an error occurs
  }
}
// Function to fetch reservation by ID from Firebase
async function getReservationById(reservationId) {
  try {
    const dbRef = ref(database);
    const reservationSnapshot = await get(child(dbRef, `reservations/${reservationId}`));

    if (reservationSnapshot.exists()) {
      return reservationSnapshot.val(); // Return the reservation data
    } else {
      return null; // If the reservation does not exist
    }
  } catch (error) {
    console.error("Error fetching reservation:", error);
    return null; // Return null if an error occurs
  }
}

// Admin dashboard route
adminRouter.get("/dashboard", async (req, res) => {
  try {
    // Fetch food items and reservations from Firebase
    const dbRef = ref(database);
    const foodSnapshot = await get(child(dbRef, "foods"));
    const reservationSnapshot = await get(child(dbRef, "reservations"));
    const gallerySnapshot = await get(child(dbRef, "gallery"));
    const feedbackSnapshot = await get(child(dbRef, "contacts"));
    const foods = foodSnapshot.exists() ? foodSnapshot.val() : {};
    const reservations = reservationSnapshot.exists() ? reservationSnapshot.val() : {};
    const gallery = gallerySnapshot.exists() ? gallerySnapshot.val() : {};
    const feedback = feedbackSnapshot.exists() ? feedbackSnapshot.val() : {};
    console.log(reservations);
    res.render("admin/dashboard", { foods, reservations, gallery, feedback });
  } catch (error) {
    console.error("Error loading dashboard:", error);
    res.status(500).send("Error loading dashboard.");
  }
});

// Add food item
adminRouter.post("/add-food", upload.single("foodImage"), async (req, res) => {
  try {
    const { foodName, foodPrice, foodDescription, foodCategory, foodOriginalPrice, isBestSeller } = req.body;

    if (!foodName || !foodPrice || !foodDescription || !foodCategory || !foodOriginalPrice || !req.file) {
      return res.status(400).send("All fields are required.");
    }

    const foodRef = push(ref(database, "foods"));
    await set(foodRef, {
      name: foodName,
      price: foodPrice,
      originalPrice: foodOriginalPrice, // Added originalPrice field
      description: foodDescription, // Added description field
      category: foodCategory, // Added category field
      imagePath: `/uploads/${req.file.filename}`, // Local file path
      isBestSeller: isBestSeller === "on", // Set best seller status (true if checked)
    });

    res.redirect("/admin/dashboard");
  } catch (error) {
    console.error("Error adding food item:", error);
    res.status(500).send("Error adding food item.");
  }
});

// Edit food route
adminRouter.get("/edit-food/:id", async (req, res) => {
  const foodId = req.params.id;

  // Fetch food item from Firebase by ID
  const food = await getFoodById(foodId);
  
  if (!food) {
    return res.status(404).send("Food item not found");
  }

  // Render the edit page with the food data
  res.render("admin/edit-food", { food, foodId });
});

// Update food item
adminRouter.post("/update-food/:id", upload.single("foodImage"), async (req, res) => {
  try {
    const foodId = req.params.id;
    const { foodName, foodPrice, foodDescription, foodCategory, foodOriginalPrice, isBestSeller } = req.body;

    if (!foodName || !foodPrice || !foodDescription || !foodCategory || !foodOriginalPrice) {
      return res.status(400).send("Food name, price, description, category, and original price are required.");
    }

    // Fetch current food data from Firebase
    const foodRef = ref(database, `foods/${foodId}`);
    const snapshot = await get(foodRef);

    if (!snapshot.exists()) {
      return res.status(404).send("Food item not found.");
    }

    const currentFood = snapshot.val();

    // Determine the image path to save (use existing image if no new image is uploaded)
    const imagePath = req.file ? req.file.path : currentFood.imagePath;

    // Build the updated food object
    const updates = {
      name: foodName,
      price: foodPrice,
      originalPrice: foodOriginalPrice, // Updated originalPrice field
      description: foodDescription, // Updated description field
      category: foodCategory, // Updated category field
      isBestSeller: isBestSeller === "on", // Update best seller status (true if checked)
      imagePath, // Preserve or update imagePath
    };

    // Update food in the database
    await set(foodRef, updates);

    res.redirect("/admin/dashboard");
  } catch (error) {
    console.error("Error updating food item:", error);
    res.status(500).send("Error updating food item.");
  }
});


// Delete food item
adminRouter.post("/delete-food/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await remove(ref(database, `foods/${id}`));
    res.redirect("/admin/dashboard");
  } catch (error) {
    console.error("Error deleting food item:", error);
    res.status(500).send("Error deleting food item.");
  }
});

// Add Reservation
adminRouter.post("/add-reservation", upload.single("reservationImage"), async (req, res) => {
  try {
    const { Name, numOfPeople, numOfTables, reservationDescription } = req.body;
    const reservationImage = req.file ? `/uploads/${req.file.filename}` : null;  // Optional image field

    if (!Name || !numOfPeople || !numOfTables || !reservationDescription) {
      return res.redirect("/admin/dashboard"); // Redirect with error if required fields are missing
    }

    const reservationRef = push(ref(database, "reservations"));
    await set(reservationRef, {
      Name,
      numOfPeople,
      numOfTables,
      reservationDescription,
      status: "available", // Set initial status to "Pending"
      imagePath: reservationImage, // Store image if uploaded
    });

   
    return res.redirect("/admin/dashboard");  // Redirect with success message
  } catch (error) {
    console.error("Error adding reservation:", error);

    return res.redirect("/admin/dashboard");  // Redirect on error
  }
});
// Edit reservation route
adminRouter.get("/edit-reservation/:id", async (req, res) => {
  const reservationId = req.params.id;

  // Fetch reservation from Firebase by ID
  const reservation = await getReservationById(reservationId);

  if (!reservation) {
    return res.status(404).send("Reservation not found");
  }

  // Render the edit page with the reservation data
  res.render("admin/edit-reservation", { reservation, reservationId });
});

// Update reservation status route
adminRouter.post("/update-reservation-status/:id", async (req, res) => {
  const reservationId = req.params.id;
  const { status } = req.body;

  if (!status) {
    return res.status(400).send("Status is required.");
  }

  try {
    // Fetch the reservation from Firebase by ID
    const reservationRef = ref(database, `reservations/${reservationId}`);
    const snapshot = await get(reservationRef);

    if (!snapshot.exists()) {
      console.error(`Reservation with ID ${reservationId} not found.`);
      return res.status(404).send("Reservation not found.");
    }

    // Log the current reservation data for debugging purposes
    console.log("Current Reservation Data:", snapshot.val());

    // Update only the status field in the reservation data
    await update(reservationRef, { status });

    console.log(`Reservation ${reservationId} updated successfully with status: ${status}`);

    res.redirect("/admin/dashboard"); // Reload the page to reflect changes
  } catch (error) {
    console.error("Error updating reservation status:", error); // Detailed error log
    res.status(500).send("Error updating reservation status.");
  }
});





// Delete Reservation
adminRouter.post("/delete-reservation/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await remove(ref(database, `reservations/${id}`));
   
    res.redirect("/admin/dashboard");
  } catch (error) {
    console.error("Error deleting reservation:", error);
    
    res.redirect("/admin/dashboard");
  }
});

// Add a gallery image
adminRouter.post("/add-gallery-image", upload.single("galleryImage"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("Image file is required.");
    }

    const galleryRef = push(ref(database, "gallery"));
    await set(galleryRef, {
      imagePath: `/uploads/${req.file.filename}`, // Save the uploaded image path
    });

    res.redirect("/admin/dashboard");
  } catch (error) {
    console.error("Error adding gallery image:", error);
    res.status(500).send("Error adding gallery image.");
  }
});

// Delete a gallery image
adminRouter.post("/delete-gallery-image/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await remove(ref(database, `gallery/${id}`));
    res.redirect("/admin/dashboard");
  } catch (error) {
    console.error("Error deleting gallery image:", error);
    res.status(500).send("Error deleting gallery image.");
  }
});

adminRouter.post('/delete-feedback/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const feedbackRef = ref(database, `contacts/${id}`);
   
    // Remove feedback entry
    await remove(feedbackRef);

    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error("Error deleting feedback:", error);
    res.status(500).send("Error deleting feedback.");
  }
});

module.exports = adminRouter;
