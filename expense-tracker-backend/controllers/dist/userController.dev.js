"use strict";

var User = require("../models/User"); // @desc   Create new user
// @route  POST /api/users


var createUser = function createUser(req, res) {
  var _req$body, name, email, existingUser, user;

  return regeneratorRuntime.async(function createUser$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, name = _req$body.name, email = _req$body.email;

          if (!(!name || !email)) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            message: "Name and email are required"
          }));

        case 4:
          _context.next = 6;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 6:
          existingUser = _context.sent;

          if (!existingUser) {
            _context.next = 9;
            break;
          }

          return _context.abrupt("return", res.status(409).json({
            message: "User already exists"
          }));

        case 9:
          _context.next = 11;
          return regeneratorRuntime.awrap(User.create({
            name: name,
            email: email
          }));

        case 11:
          user = _context.sent;
          res.status(201).json(user);
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
};

module.exports = {
  createUser: createUser
};
//# sourceMappingURL=userController.dev.js.map
