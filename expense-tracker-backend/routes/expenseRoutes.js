const express = require("express");
const router = express.Router();
const {
  createExpense,
  getExpenses,
  getMonthlyTotal,
  getCategorySummary,
  updateExpense,
  deleteExpense
} = require("../controllers/expenseController");
const { protect } = require("../middleware/authMiddleware");

// All expense routes should be protected
router.use(protect);

router.post("/", createExpense);
router.get("/", getExpenses); // Changed from /user/:userId to /
router.get("/monthly", getMonthlyTotal); // Changed from /user/:userId/monthly to /monthly
router.get("/category-summary", getCategorySummary); // Changed from /user/:userId/category-summary
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);

module.exports = router;