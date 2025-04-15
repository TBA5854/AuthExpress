import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function connectDB(): Promise<void> {
    try {
        await prisma.$connect();
        console.log('Database connected via Prisma');
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
}

process.on('beforeExit', async () => {
    await prisma.$disconnect();
    console.log('Disconnected from database');
});

export default prisma;
