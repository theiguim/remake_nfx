import { PageHandler } from "adminjs"
import { prisma } from "../database"
import { Components } from "./components/componentLoader"



export const dashboardOptions: {
    handler?: PageHandler
    component?: string
} =  {
    handler: async (req, res, context) => {
        const courses = await prisma.courses.count()
        const episodes = await prisma.episodes.count()
        const category = await prisma.categories.count()
        const standardUsers = await prisma.users.count({ where: { role: 'user' } })

        res.json({
            'Cursos': courses,
            'Episódios': episodes,
            'Categorias': category,
            'Usuários': standardUsers
        })
    },
    component: Components.Dashboard
}