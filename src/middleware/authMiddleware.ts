import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

interface Token {
    user_id: string,
    iat: number,
    exp: number
}

export function authverify(req: Request, res: Response, next: Function): void {
    const incomimg_token = req.cookies;
    if (!incomimg_token) {
        res.redirect("/signup");
        return;
    }
    if (!incomimg_token['X-Auth-Token']) {
        res.redirect("/login");
        return;
    }
    jwt.verify(incomimg_token['X-Auth-Token'], 'This is supposed to be secret , made with <3 by tba', (err: any, _decodedtoken: any) => {
        if (err) {
            res.redirect("/login");
            return;
        }
        else {
            // console.log(decodedtoken);
            next();
        }
    });
    return;
}

export async function isAdmin(req: Request, res: Response, next: Function): Promise<void> {
    const incomimg_token = req.cookies;
    const decodedToken: Token = jwt.verify(incomimg_token['X-Auth-Token'], 'This is supposed to be secret , made with <3 by tba') as Token;
    console.log(decodedToken);
    const user = await User.findById(decodedToken.user_id);

    if (user?.admin) {
        console.log(user)
        next();
    } else {
        res.send("Not Authorised");
    }
}