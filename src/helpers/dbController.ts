import mongooose from "mongoose";

export function connectDB(): void {
    // Database connection 🥳
    mongooose.connect(process.env.DB_URL as string)
    const connection = mongooose.connection;
    connection.once('open', () => {
        console.log('Database connected');
    });
}