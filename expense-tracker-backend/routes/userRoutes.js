const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  updateBudget,
  deleteAccount,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.put("/budget", protect, updateBudget);
router.delete("/me", protect, deleteAccount);

module.exports = router;