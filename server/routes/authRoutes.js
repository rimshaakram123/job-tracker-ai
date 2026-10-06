const express = require("express");
const router = express.Router();

const { registerUser, loginUser } = require("../controllers/authController");

console.log("Auth routes loaded");

router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
router.get("/test-login", (req, res) => {
  res.send("Login route exists");
});