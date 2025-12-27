"use strict";

var express = require("express");

var dotenv = require("dotenv");

var cors = require("cors");

var connectDB = require("./config/db");

dotenv.config();
connectDB();
var app = express(); // middleware

app.use(cors());
app.use(express.json()); // routes

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/expenses", require("./routes/expenseRoutes"));
var PORT = process.env.PORT || 5000;
app.listen(PORT, function () {
  console.log("Server running on port ".concat(PORT));
});
//# sourceMappingURL=server.dev.js.map
