"use strict";

var express = require("express");

var _require = require("../controllers/userController"),
    createUser = _require.createUser;

var router = express.Router();
router.post("/", createUser);
module.exports = router;
//# sourceMappingURL=userRoutes.dev.js.map
