import AdminJS, { ComponentLoader } from "adminjs"
import AdminJsExpress from "@adminjs/express"
//@ts-ignore
import { Database, Resource, getModelByName } from '@adminjs/prisma'
import { prisma } from "../database";
import { courseResourceFeature } from "./resources/course";
import { episodeResourceFeatures } from "./resources/episodes";
import { userResourceOptions } from "./resources/user";
import bcrypt from "bcrypt"


AdminJS.registerAdapter({ Database, Resource })

const componentLoader = new ComponentLoader()
const Components = {
    Dashboard: componentLoader.add("Dashboard", "C:/Users/Igor/Documents/VSCODE/OBC/ONEBITFLIX/src/adminjs/components/Dashboard.tsx"),
}

export const adminJs = new AdminJS({
    resources: [
        {
            resource: { model: getModelByName("Categories"), client: prisma },
            // options: categoryResourceOptions
        },
        {
            resource: { model: getModelByName("Courses"), client: prisma },
            // options: categoryResourceOptions,
            features: courseResourceFeature
        },
        {
            resource: { model: getModelByName("Episodes"), client: prisma },
            // options: episodeResourceOptions,
            features: episodeResourceFeatures
        },
        {
            resource: { model: getModelByName("Users"), client: prisma },
            options: userResourceOptions
        }
    ],
    dashboard: {
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
    },
    componentLoader,
    rootPath: "/admin",
    branding: {
        companyName: 'OneBitFlix',
        logo: './logoOnebitflix.svg',
        theme: {
            colors: {
                primary100: '#ff0043',
                primary80: '#ff1a57',
                primary60: '#ff3369',
                primary40: '#ff4d7c',
                primary20: '#ff668f',
                grey100: '#151515',
                grey80: '#333333',
                grey60: '#4d4d4d',
                grey40: '#666666',
                grey20: '#dddddd',
                filterBg: '#333333',
                accent: '#151515',
                hoverBg: '#151515',
            }
        }
    },

})

export const adminJrRouter = AdminJsExpress.buildAuthenticatedRouter(adminJs, {
    authenticate: async (email, password) => {
        const user = await prisma.users.findUnique({ where: { email } })

        if (user && user.role === "admin") {
            const matched = await bcrypt.compare(password, user.password)

            if (matched) return user
        }
        return false
    },
    cookiePassword: "senha-do-cookie"
}, null, {
    resave: false,
    saveUninitialized: false
});


// export const adminJrRouter = AdminJsExpress.buildRouter(adminJs)




