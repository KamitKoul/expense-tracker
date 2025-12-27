const mongoose = require("mongoose");
const Expense = require("../models/Expense");
const User = require("../models/User");

// @desc   Create new expense
// @route  POST /api/expenses
const createExpense = async (req, res) => {
  try {
    const { userId, title, amount, category, expenseDate } = req.body;

    if (!userId || !title || !amount || !category || !expenseDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    const expense = await Expense.create({
      userId,
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

// @desc   Get all expenses for a user
// @route  GET /api/expenses/user/:userId
const getExpensesByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const expenses = await Expense.find({ userId })
      .sort({ expenseDate: -1 });

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc   Get total expenses for a user in a month
// @route  GET /api/expenses/user/:userId/monthly
const getMonthlyTotal = async (req, res) => {
  try {
    const { userId } = req.params;
    const { year, month } = req.query;

    if (!year || !month) {
      return res.status(400).json({ message: "Year and month are required" });
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const result = await Expense.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
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
// @route  GET /api/expenses/user/:userId/category-summary
const getCategorySummary = async (req, res) => {
  try {
    const { userId } = req.params;

    const summary = await Expense.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId)
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
    const expense = await Expense.findByIdAndDelete(id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json({ message: "Expense removed" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createExpense,
  getExpensesByUser,
  getMonthlyTotal,
  getCategorySummary,
  updateExpense,
  deleteExpense
};
