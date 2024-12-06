import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../models/User";
import { prisma } from "../database";

export interface authenticatedRequest extends Request {
    user?: User | null
}

export async function ensureAuth(req: authenticatedRequest, res: Response, next: NextFunction) {

    const authorizationHeader = req.headers.authorization
    try {

        if (!authorizationHeader) {
            res.status(401).json({ message: "Access denied. No token provided." });
            return
        }

        const token = authorizationHeader.replace(/Bearer\s?/, "");

        if (!process.env.SECRETKEYJWT) {
            throw new Error("token env not defined.");
        }

        const decoded = jwt.verify(token, process.env.SECRETKEYJWT) as JwtPayload;

        const user = await prisma.users.findUnique({
            where: { email: decoded.email },
        });

        if (!user) {
            res.status(404).json({ message: "User not found." });
            return
        }

        req.user = user;
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({ message: "Invalid token." });
            return
        }

        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
            return
        }

        res.status(500).json({ message: "Internal server error." });
    }
}

export async function ensureAuthViaQuery(req: authenticatedRequest, res: Response, next: NextFunction) {

    const { token } = req.query

    if (!token) {
        res.status(401).json({ message: "Access denied. No token provided." });
        return
    }

    if (typeof token !== "string") {
        res.status(400).json({
            message: "token param must be string"
        })

        return
    }

    if (!process.env.SECRETKEYJWT) {
        throw new Error("token env not defined.");
    }

    const decode = jwt.verify(token, process.env.SECRETKEYJWT) as JwtPayload

    if(!decode){
        res.status(400).json({message: "Access denied, invalid token"})
    }

    const user = await prisma.users.findUnique({where: {email: decode.email}});

    req.user = user
    next()

}