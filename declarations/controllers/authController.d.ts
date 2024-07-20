import { Request, Response } from "express";
export declare function login(req: Request, res: Response): Promise<void>;
export declare function logout(_req: Request, res: Response): void;
export declare function signup(req: Request, res: Response): Promise<void>;
export declare function makeUserAdmin(req: Request, res: Response): Promise<void>;
export declare function revokeAdmin(req: Request, res: Response): Promise<void>;
