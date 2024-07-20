"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
exports.logout = logout;
exports.signup = signup;
exports.toombify = toombify;
exports.detoombify = detoombify;
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
async function login(req, res) {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User_1.default.findOne({ email }).exec();
    console.log(user);
    if (!user) {
        res.status(403).send("User Doesn't Exists");
        return;
    }
    const loggingUser = await bcrypt_1.default.compare(password, user.password);
    if (!loggingUser) {
        res.status(403).send("Incorrect Password");
        return;
    }
    console.log(loggingUser);
    const user_id = user._id;
    const token = jsonwebtoken_1.default.sign({ user_id }, 'This is supposed to be secret , made with <3 by tba', { expiresIn: '180d' });
    res.cookie('X-Auth-Token', token, { maxAge: 86400000 });
    res.send({ token, user_id });
}
function logout(_req, res) {
    res.cookie('X-Auth-Token', '', { maxAge: 1 });
    res.send("Logout Successful");
}
async function signup(req, res) {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const description = req.body.description;
    const toombstone = (req.body.toombstone) ? true : false;
    const toombstonedAt = (toombstone) ? new Date() : null;
    const createdAt = new Date();
    const updatedAt = new Date();
    console.log(req.body);
    if (await User_1.default.exists({ email })) {
        res.status(400).send("User Already Exists");
    }
    else {
        try {
            const usr = await User_1.default.create({
                username,
                password,
                email,
                description,
                createdAt,
                updatedAt,
                toombstone,
                toombstonedAt
            });
            const user_id = usr._id;
            const token = jsonwebtoken_1.default.sign({ user_id }, 'This is supposed to be secret , made with <3 by tba', { expiresIn: '180d' });
            res.cookie('X-Auth-Token', token, { maxAge: 86400000 });
            res.status(201).json({ token, usr });
        }
        catch (err) {
            res.status(500).send(err.message);
        }
    }
}
async function toombify(req, res) {
    const username = req.query.username;
    const user = await User_1.default.findOneAndUpdate({ username }, { toombstone: true, toombstonedAt: new Date() });
    if (!user) {
        res.send("User Not Found");
        return;
    }
    else {
        res.send("Successfully Toombified");
        return;
    }
}
async function detoombify(req, res) {
    const username = req.query.username;
    const user = await User_1.default.findOneAndUpdate({ username }, { toombstone: false, toombstonedAt: null });
    if (!user) {
        res.send("User Not Found");
        return;
    }
    else {
        res.send("Successfully DeToombified");
        return;
    }
}
