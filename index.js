const express = require("express");
const path = require("path");

const app = express();

const commonRoutes = require("./routes/index");
// const adminRoutes = require("./routes/admin");
// const userRoutes = require("./routes/user");

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.use("/", commonRoutes); // Common routes
// app.use("/admin", adminRoutes); // Admin routes
// app.use("/user", userRoutes); // User routes

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
