"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = require("validator");
const bcrypt_1 = __importDefault(require("bcrypt"));
const userSchema = new mongoose_1.default.Schema({
    "username": {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true
    },
    "email": {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: [validator_1.isEmail, 'Please enter a valid email'],
    },
    "password": {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [8, 'Minimum password length is 8 characters']
    },
    "description": {
        type: String,
        required: true
    },
    "createdAt": {
        type: Date,
        required: true
    },
    "updatedAt": {
        type: Date,
        required: true
    },
    "admin": {
        type: Boolean,
        required: true,
        default: false
    },
    "adminedAt": {
        type: Date,
        required: false,
        default: null
    },
});
userSchema.pre('save', async function (next) {
    const salt = await bcrypt_1.default.genSalt();
    this.password = await bcrypt_1.default.hash(this.password.toString(), salt);
    next();
});
const User = mongoose_1.default.model('user', userSchema);
exports.default = User;
