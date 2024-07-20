"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authverify = authverify;
exports.toombverify = toombverify;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
function authverify(req, res, next) {
    const incomimg_token = req.cookies;
    if (!incomimg_token) {
        res.redirect("/signup");
        return;
    }
    if (!incomimg_token['X-Auth-Token']) {
        res.redirect("/login");
        return;
    }
    jsonwebtoken_1.default.verify(incomimg_token['X-Auth-Token'], 'This is supposed to be secret , made with <3 by tba', (err, _decodedtoken) => {
        if (err) {
            res.redirect("/login");
            return;
        }
        else {
            next();
        }
    });
    return;
}
async function toombverify(req, res, next) {
    const incomimg_token = req.cookies;
    const decodedToken = jsonwebtoken_1.default.verify(incomimg_token['X-Auth-Token'], 'This is supposed to be secret , made with <3 by tba');
    console.log(decodedToken);
    const user = await User_1.default.findById(decodedToken.user_id);
    if (user?.toombstone) {
        console.log(user);
        next();
    }
    else {
        res.send("Not Authorised");
    }
}
