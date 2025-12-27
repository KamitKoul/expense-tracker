"use strict";

var express = require("express");

var _require = require("../controllers/expenseController"),
    createExpense = _require.createExpense,
    getExpensesByUser = _require.getExpensesByUser,
    getMonthlyTotal = _require.getMonthlyTotal,
    getCategorySummary = _require.getCategorySummary;

var router = express.Router();
router.post("/", createExpense);
router.get("/user/:userId", getExpensesByUser);
router.get("/user/:userId/monthly", getMonthlyTotal);
router.get("/user/:userId/category-summary", getCategorySummary);
module.exports = router;
//# sourceMappingURL=expenseRoutes.dev.js.map
