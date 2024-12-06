import { Request, Response } from "express"
import { prisma } from "../database"

export const categoriesController = {
    index: async (req: Request, res: Response) => {

        const { page = 1, pageSize = 10 } = req.query
        const skip = (+page - 1) * +pageSize
        const take = +pageSize

        try {
            const categories = await prisma.categories.findMany({
                orderBy: {
                    position: "asc"
                },
                select: {
                    id: true,
                    name: true,
                    position: true
                },
                skip,
                take
            });
            const total = await prisma.categories.count();
            res.status(201).json({ categories, page: skip, pageNumber: take, total })
            return
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: "fail" })
            }
            return
        }
    },

    show: async (req: Request, res: Response) => {

        try {

            const category = await prisma.categories.findUnique({
                where: { id: +req.params.id },
                select: {
                    id: true,
                    name: true,
                    courses: {
                        select: {
                            id: true,
                            name: true,
                            synopsis: true,
                            thumbnailUrl: true
                        }
                    }
                }
            })

            res.status(201).json(category)
            return

        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: "fail" })
            }
            return
        }
    }
}