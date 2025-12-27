const express = require("express");
const {
  createExpense,
  getExpensesByUser,
  getMonthlyTotal,
  getCategorySummary,
  updateExpense,
  deleteExpense
} = require("../controllers/expenseController");

const router = express.Router();

router.post("/", createExpense);
router.get("/user/:userId", getExpensesByUser);
router.get("/user/:userId/monthly", getMonthlyTotal);
router.get("/user/:userId/category-summary", getCategorySummary);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);

module.exports = router;
