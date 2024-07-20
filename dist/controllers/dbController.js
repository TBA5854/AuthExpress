"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
const mongoose_1 = __importDefault(require("mongoose"));
function connectDB() {
    // Database connection 🥳
    mongoose_1.default.connect('mongodb://auth:auth@localhost:27017/Auth');
    const connection = mongoose_1.default.connection;
    connection.once('open', () => {
        console.log('Database connected');
    });
}
