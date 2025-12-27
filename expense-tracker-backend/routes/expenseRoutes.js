const express = require("express");
const router = express.Router();
const {
  createExpense,
  getExpenses,
  getMonthlyTotal,
  getCategorySummary,
  updateExpense,
  deleteExpense,
  getSpendingTrends
} = require("../controllers/expenseController");
const { protect } = require("../middleware/authMiddleware");

// All expense routes should be protected
router.use(protect);

router.post("/", createExpense);
router.get("/", getExpenses);
router.get("/monthly", getMonthlyTotal);
router.get("/category-summary", getCategorySummary);
router.get("/trends", getSpendingTrends);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);

module.exports = router;
