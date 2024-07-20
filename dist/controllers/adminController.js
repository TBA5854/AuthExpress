"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeUserAdmin = makeUserAdmin;
exports.revokeAdmin = revokeAdmin;
const User_1 = __importDefault(require("../models/User"));
async function makeUserAdmin(req, res) {
    const username = req.query.username;
    const user = await User_1.default.findOneAndUpdate({ username }, { admin: true, adminedAt: new Date() });
    if (!user) {
        res.send("User Not Found");
        return;
    }
    else {
        res.send("Successfully Adminified");
        return;
    }
}
async function revokeAdmin(req, res) {
    const username = req.query.username;
    const user = await User_1.default.findOneAndUpdate({ username }, { admin: false, adminedAt: null });
    if (!user) {
        res.send("User Not Found");
        return;
    }
    else {
        res.send("Successfully DeAdminified");
        return;
    }
}
