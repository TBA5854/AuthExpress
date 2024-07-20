"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const authRoute_1 = __importDefault(require("../Routes/authRoute"));
const dbController_1 = require("../Controllers/dbController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(authRoute_1.default);
(0, dbController_1.connectDB)();
const port = 3000;
app.get('/', authMiddleware_1.authverify, (_req, res) => {
    res.send('Hello World!');
});
app.listen(port, () => console.log(`Auth Server port ${port}!`));
