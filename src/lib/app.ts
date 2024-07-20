import express, { Express, Request, Response } from 'express';
import cookieParser from "cookie-parser";
import router from '../routes/authRoute';
import { connectDB } from "../helpers/dbController";
import { authverify } from '../middleware/authMiddleware';
const app: Express = express();

app.use(express.json());
app.use(cookieParser());
app.use(router);
connectDB();

const port = 3000

app.get('/', authverify, (_req: Request, res: Response) => {
    res.send('Hello World!')
})
app.listen(port, () => console.log(`Auth Server port ${port}!`))