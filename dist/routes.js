"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const middleware_1 = require("./middleware");
const controllers_1 = require("./controllers");
function routes(app) {
    app.get('/', (req, res) => {
        res.status(500).json('no');
    });
    app.get('/heartbeat', (req, res) => {
        res.status(200).json('thump thump');
    });
    app.post('/discord/interactions', controllers_1.discordController);
    app.use('/api', middleware_1.tokenMiddleware);
    app.get('/api/faucet', controllers_1.faucetController);
    app.get('/api/balance', controllers_1.balanceController);
}
exports.routes = routes;
//# sourceMappingURL=routes.js.map