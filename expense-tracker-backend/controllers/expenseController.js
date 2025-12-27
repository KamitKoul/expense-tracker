const mongoose = require("mongoose");
const Expense = require("../models/Expense");
const User = require("../models/User");

// @desc   Create new expense
// @route  POST /api/expenses
const createExpense = async (req, res) => {
  try {
    const { title, amount, category, expenseDate } = req.body;

    if (!title || !amount || !category || !expenseDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const expense = await Expense.create({
      userId: req.user.id,
      title,
      amount,
      category,
      expenseDate
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc   Get all expenses for the logged-in user
// @route  GET /api/expenses
const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id })
      .sort({ expenseDate: -1 });

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc   Get total expenses for a user in a month
// @route  GET /api/expenses/monthly
const getMonthlyTotal = async (req, res) => {
  try {
    const { year, month } = req.query;

    if (!year || !month) {
      return res.status(400).json({ message: "Year and month are required" });
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const result = await Expense.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user.id),
          expenseDate: { $gte: startDate, $lt: endDate }
        }
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" }
        }
      }
    ]);

    res.json({
      total: result.length > 0 ? result[0].totalAmount : 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc   Category-wise expense summary
// @route  GET /api/expenses/category-summary
const getCategorySummary = async (req, res) => {
  try {
    const summary = await Expense.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user.id)
        }
      },
      {
        $group: {
          _id: "$category",
          totalSpent: { $sum: "$amount" }
        }
      },
      {
        $sort: { totalSpent: -1 }
      }
    ]);

    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc   Update an expense
// @route  PUT /api/expenses/:id
const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, amount, category, expenseDate } = req.body;

    const expense = await Expense.findById(id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Check for user
    if (!req.user) {
        return res.status(401).json({ message: "User not found" });
    }

    // Make sure the logged in user matches the expense user
    if (expense.userId.toString() !== req.user.id) {
        return res.status(401).json({ message: "User not authorized" });
    }

    expense.title = title || expense.title;
    expense.amount = amount || expense.amount;
    expense.category = category || expense.category;
    expense.expenseDate = expenseDate || expense.expenseDate;

    const updatedExpense = await expense.save();
    res.json(updatedExpense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc   Delete an expense
// @route  DELETE /api/expenses/:id
const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findById(id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Check for user
    if (!req.user) {
        return res.status(401).json({ message: "User not found" });
    }

    // Make sure the logged in user matches the expense user
    if (expense.userId.toString() !== req.user.id) {
        return res.status(401).json({ message: "User not authorized" });
    }

    await expense.deleteOne();

    res.json({ message: "Expense removed" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc   Get spending trends (last 6 months)
// @route  GET /api/expenses/trends
const getSpendingTrends = async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const trends = await Expense.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user.id),
          expenseDate: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$expenseDate" },
            month: { $month: "$expenseDate" }
          },
          total: { $sum: "$amount" }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ]);

    res.json(trends);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createExpense,
  getExpenses,
  getMonthlyTotal,
  getCategorySummary,
  updateExpense,
  deleteExpense,
  getSpendingTrends
};