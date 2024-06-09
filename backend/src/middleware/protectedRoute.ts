import "dotenv/config";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface DecodeToken extends JwtPayload {
    user_id: string
}

declare global {
    namespace Express {
        export interface Request {
            user_id: string;
        }
    }
}

export const protectedRoute = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt;
    if (!token) {
        res.status(401).json({ error: "Authorization failed. No access token" });
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET!) as DecodeToken;
        req.user_id = decode.user_id;
        next();
    } catch (e: any) {
        res.status(403).json({ msg: "Unauthorized: Token verification failed" });
        console.log(e.message);
    }
}