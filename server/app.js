"use strict";
exports.__esModule = true;
var express_1 = require("express");
var dotenv_1 = require("dotenv");
dotenv_1["default"].config();
var PORT = process.env.PORT;
var app = (0, express_1["default"])();
app.get('/', function (req, res) {
    res.send('Express + TypeScript Server');
});
app.listen(PORT, function () {
    console.log("\u26A1\uFE0F[server]: Server is running at https://localhost:".concat(PORT));
});
