const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const messageControllers = require("../controllers/messageControllers");

router.route("/").post(protect, messageControllers.sendMessage);
router.route("/:chatId").get(protect, messageControllers.fetchAllMessages);

module.exports = router;