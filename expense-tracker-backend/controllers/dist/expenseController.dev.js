"use strict";

var mongoose = require("mongoose");

var Expense = require("../models/Expense");

var User = require("../models/User"); // @desc   Create new expense
// @route  POST /api/expenses


var createExpense = function createExpense(req, res) {
  var _req$body, userId, title, amount, category, expenseDate, userExists, expense;

  return regeneratorRuntime.async(function createExpense$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, userId = _req$body.userId, title = _req$body.title, amount = _req$body.amount, category = _req$body.category, expenseDate = _req$body.expenseDate;

          if (!(!userId || !title || !amount || !category || !expenseDate)) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            message: "All fields are required"
          }));

        case 4:
          _context.next = 6;
          return regeneratorRuntime.awrap(User.findById(userId));

        case 6:
          userExists = _context.sent;

          if (userExists) {
            _context.next = 9;
            break;
          }

          return _context.abrupt("return", res.status(404).json({
            message: "User not found"
          }));

        case 9:
          _context.next = 11;
          return regeneratorRuntime.awrap(Expense.create({
            userId: userId,
            title: title,
            amount: amount,
            category: category,
            expenseDate: expenseDate
          }));

        case 11:
          expense = _context.sent;
          res.status(201).json(expense);
          _context.next = 18;
          break;

        case 15:
          _context.prev = 15;
          _context.t0 = _context["catch"](0);
          res.status(500).json({
            error: _context.t0.message
          });

        case 18:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 15]]);
}; // @desc   Get all expenses for a user
// @route  GET /api/expenses/user/:userId


var getExpensesByUser = function getExpensesByUser(req, res) {
  var userId, expenses;
  return regeneratorRuntime.async(function getExpensesByUser$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          userId = req.params.userId;
          _context2.next = 4;
          return regeneratorRuntime.awrap(Expense.find({
            userId: userId
          }).sort({
            expenseDate: -1
          }));

        case 4:
          expenses = _context2.sent;
          res.json(expenses);
          _context2.next = 11;
          break;

        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](0);
          res.status(500).json({
            error: _context2.t0.message
          });

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 8]]);
}; // @desc   Get total expenses for a user in a month
// @route  GET /api/expenses/user/:userId/monthly


var getMonthlyTotal = function getMonthlyTotal(req, res) {
  var userId, _req$query, year, month, startDate, endDate, result;

  return regeneratorRuntime.async(function getMonthlyTotal$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          userId = req.params.userId;
          _req$query = req.query, year = _req$query.year, month = _req$query.month;

          if (!(!year || !month)) {
            _context3.next = 5;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            message: "Year and month are required"
          }));

        case 5:
          startDate = new Date(year, month - 1, 1);
          endDate = new Date(year, month, 1);
          _context3.next = 9;
          return regeneratorRuntime.awrap(Expense.aggregate([{
            $match: {
              userId: new mongoose.Types.ObjectId(userId),
              expenseDate: {
                $gte: startDate,
                $lt: endDate
              }
            }
          }, {
            $group: {
              _id: null,
              totalAmount: {
                $sum: "$amount"
              }
            }
          }]));

        case 9:
          result = _context3.sent;
          res.json({
            total: result.length > 0 ? result[0].totalAmount : 0
          });
          _context3.next = 16;
          break;

        case 13:
          _context3.prev = 13;
          _context3.t0 = _context3["catch"](0);
          res.status(500).json({
            error: _context3.t0.message
          });

        case 16:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 13]]);
}; // @desc   Category-wise expense summary
// @route  GET /api/expenses/user/:userId/category-summary


var getCategorySummary = function getCategorySummary(req, res) {
  var userId, summary;
  return regeneratorRuntime.async(function getCategorySummary$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          userId = req.params.userId;
          _context4.next = 4;
          return regeneratorRuntime.awrap(Expense.aggregate([{
            $match: {
              userId: new mongoose.Types.ObjectId(userId)
            }
          }, {
            $group: {
              _id: "$category",
              totalSpent: {
                $sum: "$amount"
              }
            }
          }, {
            $sort: {
              totalSpent: -1
            }
          }]));

        case 4:
          summary = _context4.sent;
          res.json(summary);
          _context4.next = 11;
          break;

        case 8:
          _context4.prev = 8;
          _context4.t0 = _context4["catch"](0);
          res.status(500).json({
            error: _context4.t0.message
          });

        case 11:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

module.exports = {
  createExpense: createExpense,
  getExpensesByUser: getExpensesByUser,
  getMonthlyTotal: getMonthlyTotal,
  getCategorySummary: getCategorySummary
};
//# sourceMappingURL=expenseController.dev.js.map
