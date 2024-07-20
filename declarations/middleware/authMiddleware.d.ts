import { Request, Response } from "express";
export declare function authverify(req: Request, res: Response, next: Function): void;
export declare function toombverify(req: Request, res: Response, next: Function): Promise<void>;
