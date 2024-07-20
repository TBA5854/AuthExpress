import { Request, Response } from "express";
import User from "../models/User";

export async function makeUserAdmin(req: Request, res: Response): Promise<void> {
    const username = req.query.username;
    const user = await User.findOneAndUpdate({ username }, { admin: true, adminedAt: new Date() })
    if (!user) {
        res.send("User Not Found");
        return;
    } else {
        res.send("Successfully Adminified");
        return;
    }
}

export async function revokeAdmin(req: Request, res: Response): Promise<void> {
    const username = req.query.username;
    const user = await User.findOneAndUpdate({ username }, { admin: false, adminedAt: null })
    if (!user) {
        res.send("User Not Found");
        return;
    } else {
        res.send("Successfully DeAdminified");
        return;
    }
}