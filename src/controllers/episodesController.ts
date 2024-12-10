import { Request, Response } from "express";
import { fstatSync } from "fs";
import path from "path";
import fs from "fs"
import { prisma } from "../database";
import { authenticatedRequest } from "../middlewares/auth";

export const episodesController = {
    stream: async (req: Request, res: Response) => {
        const { videoUrl } = req.query

        try {
            if (typeof videoUrl !== "string") throw new Error("videoUrl param must be of type string")

            const filePath = path.join(__dirname, "..", "..", "uploads", videoUrl)
            const fileStat = fs.statSync(filePath)

            const range = req.headers.range

            if (range) {
                const parts = range.replace(/bytes=/, '').split('-')

                const start = parseInt(parts[0], 10)
                const end = parts[1] ? parseInt(parts[1], 10) : fileStat.size - 1

                const chunkSize = (end - start) + 1

                const file = fs.createReadStream(filePath, { start, end })

                const head = {
                    'Content-Range': `bytes ${start} - ${end}/${fileStat.size}`,
                    'Accept-Ranges': 'bytes',
                    'Content-Length': chunkSize,
                    'Content-Type': 'video/mp4'
                }

                res.writeHead(206, head)
                file.pipe(res)
            } else {
                const head = {
                    'Content-Length': fileStat.size,
                    'Content-Type': 'video/mp4'
                }

                res.writeHead(200, head)
                fs.createReadStream(filePath).pipe(res)
            }

            return

        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: "fail" })
            }
            return
        }
    },

    getWatchTime: async (req: authenticatedRequest, res: Response) => {

        const userId = +req.user!.id
        const episodeId = +req.params.episodeId

        try {
            const watchTime = await prisma.watchTimes.findUnique({
                where: {
                    userId_episodeId: {
                        episodeId,
                        userId
                    }
                },
                select: {
                    seconds: true
                }
            })

            res.json(watchTime)
            return

        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: "fail" })
            }
            return
        }

    },

    setWatchTime: async (req: authenticatedRequest, res: Response) => {
        const userId = +req.user!.id;
        const episodeId = +req.params.episodeId;
        const { seconds } = req.body;
    
        if (typeof seconds !== "number" || seconds < 0) {
            res.status(400).json({ message: "Invalid 'seconds' value" })
            return;
        }
    
        try {
            const watchTime = await prisma.watchTimes.upsert({
                where: {
                    userId_episodeId: {
                        userId,
                        episodeId,
                    },
                },
                update: {
                    seconds,
                },
                create: {
                    userId,
                    episodeId,
                    seconds,
                },
            });
    
            res.json(watchTime);
            return
        } catch (error) {
            console.error("Error setting watch time:", error);
            res.status(500).json({ message: "Failed to set watch time" });
            return
        }
    },
}