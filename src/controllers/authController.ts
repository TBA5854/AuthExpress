import { Request, Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";



export async function login(req: Request, res: Response): Promise<void> {
    const email: string = req.body.email;
    const password: string = req.body.password;
    const user = await User.findOne({ email }).exec();
    console.log(user);
    if (!user) {
        res.status(404).send("User Doesn't Exists");
        return;
    }
    const loggingUser = await bcrypt.compare(password, user.password);
    if (!loggingUser) {
        res.status(401).send("Incorrect Password");
        return;
    }
    console.log(loggingUser);
    const user_id = user._id;
    const token = jwt.sign({ user_id }, 'This is supposed to be secret , made with <3 by tba', { expiresIn: '180d' });
    res.cookie('X-Auth-Token', token, { maxAge: 86400000 }); //160 Days
    res.send({ token, user_id });
}

export function logout(_req: Request, res: Response): void {
    res.cookie('X-Auth-Token', '', { maxAge: 1 });
    res.send("Logout Successful");
}

export async function signup(req: Request, res: Response): Promise<void> {
    const username: String = req.body.username;
    const password: String = req.body.password;
    const email: String = req.body.email;
    const description: String = req.body.description;
    const admin: boolean = (req.body.admin) ? true : false;
    const adminedAt: Date | null = (admin) ? new Date() : null;
    const createdAt: Date = new Date();
    const updatedAt: Date = new Date();

    console.log(req.body)
    if (await User.exists({ email })) {
        res.status(400).send("User Already Exists")
    }
    else {
        try {
            const usr = await User.create({
                username,
                password,
                email,
                description,
                createdAt,
                updatedAt,
                admin,
                adminedAt
            });
            // console.log(usr._id);
            const user_id = usr._id;
            const token = jwt.sign({ user_id }, 'This is supposed to be secret , made with <3 by tba', { expiresIn: '180d' });
            res.cookie('X-Auth-Token', token, { maxAge: 86400000 });     // 160 Days
            res.status(201).json({ token, usr });
            // res.redirect('/login');
        } catch (err: any) {
            res.status(500).send(err.message);
        }
    }
}

