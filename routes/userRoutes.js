const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const userControllers = require("../controllers/userControllers");

router.post("/register", userControllers.registerUser);
router.post("/login", userControllers.authUser);
router.get("/get-doctors", userControllers.fetchDoctors);

module.exports = router;
