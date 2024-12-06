import { Request, Response } from "express";
import { fstatSync } from "fs";
import path from "path";
import fs from "fs"

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
            }else{
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
    }
}