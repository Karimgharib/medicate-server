const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const chatControllers = require("../controllers/chatControllers");

router.route("/").post(protect, chatControllers.accessChat);
router.route("/").get(protect, chatControllers.fetchChat);

module.exports = router;
