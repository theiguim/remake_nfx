import { Request, Response } from "express";
import { prisma } from "../database";
import { userSchema } from "./schemas/usersSchema";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from 'dotenv';
dotenv.config();


export const userController = {

    register: async (req: Request, res: Response) => {
        const body = userSchema.parse(req.body)

        try {
            const userAlreadyExists = await prisma.users.findUnique({ where: { email: body.email } })

            if (userAlreadyExists) throw new Error("Email already exists");

            const password = await bcrypt.hash(body.password, 10)

            const user = await prisma.users.create({
                data: {
                    lastName: body.firstName,
                    firstName: body.lastName,
                    birth: body.birth,
                    email: body.email,
                    phone: body.phone,
                    password: password
                }
            })

            res.status(201).json(user)
            return

        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json(error)
            }
            return
        }
    },

    login: async (req: Request, res: Response) => {

        const { email, password } = req.body

        try {

            const user = await prisma.users.findUnique({ where: { email } })

            if (!user) {
                res.status(401).json({ message: "not registed" })
                return
            }

            const userHash = await bcrypt.compare(password, user.password);

            if (!userHash) {
                res.status(401).json({ message: "invalid password" })
            }

            const payload = {
                id: user.id,
                firstName: user.firstName,
                email: user.email
            }

            if (!process.env.SECRETKEYJWT) {
                throw new Error("SECRETKEYJWT not defined.");
            }

            const token = jwt.sign(payload, process.env.SECRETKEYJWT)

            res.status(201).json({ authenticated: true, user, token })
            return


        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json(error)
                return
            }
        }
    }
}