"use strict";

var mongoose = require("mongoose");

var expenseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 1
  },
  category: {
    type: String,
    required: true,
    "enum": ["Food", "Travel", "Rent", "Shopping", "Other"]
  },
  expenseDate: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});
module.exports = mongoose.model("Expense", expenseSchema);
//# sourceMappingURL=Expense.dev.js.map
