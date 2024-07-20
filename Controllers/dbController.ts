import mongooose from "mongoose";

export function connectDB() {
    // Database connection 🥳
    mongooose.connect('mongodb://auth:auth@localhost:27017/Auth')
    const connection = mongooose.connection;
    connection.once('open', () => {
        console.log('Database connected');
    });
}