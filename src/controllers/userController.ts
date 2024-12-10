import { Episodes, WatchTimes } from "@prisma/client";
import { authenticatedRequest } from "../middlewares/auth";
import { prisma } from "../database";
import { Response } from "express";
import { updatedUser, updatePassword } from "./schemas/usersSchema";
import bcrypt from "bcrypt"

type EpisodeWithWatchtimes = Episodes & {
    watchtimes: WatchTimes[];
};

function filterLastEpisodesByCourse(episodes: EpisodeWithWatchtimes[]) {
    const coursesOnList: number[] = []
    const lastEpisodes = episodes.reduce((currentList, episode) => {
        if (!coursesOnList.includes(episode.courseId)) {
            coursesOnList.push(episode.courseId)
            currentList.push(episode)
            return currentList
        }

        const episodeFromSameCourse = currentList.find(ep => ep.courseId === episode.courseId)

        if (episodeFromSameCourse!.order > episode.order) return currentList

        const listWithoutEpisodeFromSameCourse = currentList.filter((ep) => ep.courseId !== episode.courseId)
        listWithoutEpisodeFromSameCourse.push(episode)

        return listWithoutEpisodeFromSameCourse

    }, [] as EpisodeWithWatchtimes[])

    return lastEpisodes
}

export const userController = {

    show: async (req: authenticatedRequest, res: Response) => {

        const currentUser = req.user!

        try {
            res.json(currentUser)
            return
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json(error)
                return
            }
        }

    },
    update: async (req: authenticatedRequest, res: Response) => {

        try {

            const body = updatedUser.parse(req.body)

            const result = await prisma.users.update({
                where: { id: +req.user!.id },
                data: { ...body }
            })

            res.json(result)
            return

        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json(error)
                return
            }
        }

    },

    updatePassword: async (req: authenticatedRequest, res: Response) => {

        const {currentPassword, newPassword} = req.body

        const userHash = await bcrypt.compare(currentPassword, req.user!.password);
        if(!userHash) {
            res.json({message: "invalid current password"})
            return
        }

        const cryptPassword = await bcrypt.hash(newPassword, 10)

        try {
            const updated = await prisma.users.update({
                where: { id: +req.user!.id },
                data: {password: cryptPassword}
            })
            res.status(200).json({ message: "password updated successfully" });
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ message: "Internal server error", error: error.message });
                return
            }
        }
    },


    watching: async (req: authenticatedRequest, res: Response) => {
        try {

            const userWithWatchingEpisodes = await prisma.users.findUnique({
                where: {
                    id: +req.user!.id
                },
                include: {
                    episodes: {
                        include: {
                            courses: true,
                            watchtimes: true
                        }
                    }
                }
            }) as { episodes: EpisodeWithWatchtimes[] }

            if (!userWithWatchingEpisodes) throw new Error("User not found")

            const keepWatchingList = filterLastEpisodesByCourse(userWithWatchingEpisodes.episodes!)

            keepWatchingList.sort((a, b) => {

                const latestWatchtimeA = a.watchtimes.reduce((latest, current) =>
                    new Date(current.updatedAt) > new Date(latest.updatedAt) ? current : latest, a.watchtimes[0]);

                const latestWatchtimeB = b.watchtimes.reduce((latest, current) =>
                    new Date(current.updatedAt) > new Date(latest.updatedAt) ? current : latest, b.watchtimes[0]);

                return new Date(latestWatchtimeA.updatedAt) < new Date(latestWatchtimeB.updatedAt) ? 1 : -1;
            })

            res.json(keepWatchingList)
            return

        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json(error)
                return
            }
        }

    }

}