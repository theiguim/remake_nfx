import { Request, Response } from "express";
import { authenticatedRequest } from "../middlewares/auth";
import { prisma } from "../database";

export const likeController = {
    create: async (req: authenticatedRequest, res: Response) => {

        try {

            const like = await prisma.likes.create({
                data: {
                    userId: req.user!.id,
                    courseId: +req.body.courseId
                }
            })

            res.status(201).json(like)
            return

        } catch (error) {
            res.status(404).json({ message: "Error send like", error })
            return
        }

    },
    remove: async (req: authenticatedRequest, res: Response) => {

        try {

            const removeLike = await prisma.likes.delete({
                where: {
                    userId_courseId: {
                        courseId: +req.body.courseId,
                        userId: +req.user!.id
                    }
                }
            })
            res.status(201).json({ message: "like deleted" })
            return

        } catch (error) {
            res.status(404).json({ message: "Error remove like", error })
            return
        }

    }
}