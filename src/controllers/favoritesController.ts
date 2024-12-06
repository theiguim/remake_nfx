import { Request, Response } from "express";
import { prisma } from "../database";
import { authenticatedRequest } from "../middlewares/auth";

export const favoritesController = {


    find: async (req: authenticatedRequest, res: Response) => {

        const userId = req.user!.id;
        try {
            const favorites = await prisma.favorites.findMany({
                where: {
                    userId: userId
                },
                select: {
                    userId: true,
                    course: {
                        select: {
                            id: true,
                            name: true,
                            synopsis: true,
                            thumbnailUrl: true
                        }
                    }
                }
            })

            res.status(201).json({
                userId,
                courses: favorites.map(fav => fav.course)
            })
            return
        } catch (error) {
            res.status(404).json({ message: "Erro ao adicionar favorito", error })
            return
        }

    },

    create: async (req: authenticatedRequest, res: Response) => {


        const userId = req.user!.id;
        const { courseId } = req.body;

        if (!courseId) {
            res.status(400).json({ message: "Course ID is required" })
            return
        }
        try {
            const favorite = await prisma.favorites.create({
                data: {
                    userId: +userId,
                    courseId: +courseId
                }
            })
            res.status(201).json(favorite);
            return
        } catch (error) {
            res.status(500).json({ message: "Erro ao adicionar favorito", error })
            return
        }
    },

    delete: async (req: authenticatedRequest, res: Response) => {

        const userId = req.user!.id;

        try {
            const deletedFavorite = await prisma.favorites.delete({
                where: {
                    userId_courseId: {
                        courseId: +req.params.courseId,
                        userId
                    }
                }
            })
            res.status(201).json({ message: "Favorite deleted successfully" })
            return
        } catch (error) {
            res.status(400).json({ message: "Erro ao adicionar favorito", error })
            return
        }
    }

}