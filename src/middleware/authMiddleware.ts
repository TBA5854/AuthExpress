import { Request, Response } from "express";
import jwt from "jsonwebtoken";

// Extend the Express Request interface
declare global {
    namespace Express {
        interface Request {
            user?: string;
        }
    }
}

export function authverify(req: Request, res: Response, next: Function): void {
    const incomimg_token = req.headers;
    if (!incomimg_token) {
        res.redirect("/signup");
        return;
    }
    const bearer = incomimg_token['X-Auth-Token'];
    if (!bearer) {
        res.status(401).send("Token is required");
        return;
    }
    const bearerToken = Array.isArray(bearer) ? bearer[0].split(' ')[1] : bearer.split(' ')[1];
    if (!bearerToken) {
        res.status(401).send("Token is required");
        return;
    }
    if (bearerToken === 'null') {
        res.status(401).send("Token is null");
        return;
    }
    jwt.verify(bearerToken, 'This is supposed to be secret , made with <3 by tba', (err: any, decodedtoken: any) => {
        if (err) {
            res.status(401).send("Token is invalid");
            return;
        }
        else {
            req.user= decodedtoken.user_id;
            // console.log(decodedtoken);
            next();
        }
    });
    return;
}
