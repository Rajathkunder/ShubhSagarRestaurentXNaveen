const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("home", { title: "Home" });
});

router.get("/login", (req, res) => {
  res.render("login", { title: "Login" });
});

router.get("/signup", (req, res) => {
  res.render("signup", { title: "Signup" });
});
router.get("/aboutus", (req, res) => {
  res.render("aboutus");
});
router.get("/gallery", (req, res) => {
  res.render("gallery");
});

router.get("/menu", (req, res) => {
  res.render("menu");
});
router.get("/contactus", (req, res) => {
  res.render("contactus");
});

router.get("/tablelistings", (req, res) => {
  res.render("tablelistings");
});
router.get("/login", (req, res) => {
  res.render("login");
});
router.get("/signup", (req, res) => {
  res.render("signup");
});

module.exports = router;
