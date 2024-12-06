import { Request, Response } from "express";
import { prisma } from "../database";
import { equal } from "assert";

export const coursesController = {

    featured: async (req: Request, res: Response) => {
        try {

            const featuredCourses = await prisma.courses.findMany({
                select: {
                    id: true,
                    name: true,
                    synopsis: true,
                    thumbnailUrl: true
                },
                where: {
                    featured: true
                }
            });

            const randomFeaturedCourses = featuredCourses.sort(() => 0.5 - Math.random());

            res.json(randomFeaturedCourses.slice(0, 3))
            return

        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json(error)
            }
            return
        }
    },

    newest: async (req: Request, res: Response) => {

        try {
            const courses = await prisma.courses.findMany({
                orderBy: {
                    createdAt: "desc"
                },
                take: 10
            })

            res.json(courses)
            return
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json(error)
            }
            return
        }
    },

    show: async (req: Request, res: Response) => {
        try {

            const course = await prisma.courses.findUnique({
                where: { id: +req.params.id },
                select: {
                    id: true,
                    name: true,
                    synopsis: true,
                    thumbnailUrl: true,
                    episodes: {
                        select: {
                            id: true,
                            name: true,
                            synopsis: true,
                            order: true,
                            videoUrl: true,
                            secondsLong: true
                        },
                        orderBy: { order: "asc" },
                    },
                },
            })

            res.json(course)
            return

        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: "fail" })
            }
            return
        }
    },

    search: async (req: Request, res: Response) => {

        const { name, page = 1, pageSize = 10 } = req.query
        const skip = (+page - 1) * +pageSize
        const take = +pageSize

        try {
            if (typeof name !== "string") throw new Error("name param must be of type string")
            const courses = await prisma.courses.findMany({
                select: {
                    id: true,
                    name: true,
                    synopsis: true,
                    thumbnailUrl: true,
                },
                where: {
                    name: {
                        contains: name,
                        mode: "insensitive"
                    }
                },
                skip,
                take
            })
            const total = await prisma.categories.count();
            res.status(201).json({ courses, page: skip, pageNumber: take, total })
            return

        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json(error)
            }
            return
        }
    }

}