const express = require("express");
const adminRouter = express.Router();
const { loginHandler } = require("../controllers/authController");
adminRouter.post("/loginHandler", loginHandler);

adminRouter.get("/dashboard", (req, res) => {
  res.render("admin/dashboard");
});

module.exports = adminRouter;
