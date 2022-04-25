"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const initialize_1 = require("./discord/initialize");
const middleware_1 = require("./middleware");
const routes_1 = require("./routes");
const express_1 = __importDefault(require("express"));
const { PORT = 3000 } = process.env;
const app = (0, express_1.default)();
(0, middleware_1.middleware)(app);
(0, routes_1.routes)(app);
app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is listening on [${PORT}]`);
    (0, initialize_1.initializeBotCommands)();
});
//# sourceMappingURL=app.js.map