import AdminJS from "adminjs"
import AdminJsExpress from "@adminjs/express"
//@ts-ignore
import { Database, Resource, getModelByName } from '@adminjs/prisma'
import { prisma } from "../database";
import { categoryResourceOptions } from "./resources/category";
import { courseResourceFeature, courseResourceOptions } from "./resources/course";
import { episodeResourceFeatures, episodeResourceOptions, componentLoader } from "./resources/episodes";
import { userResourceOptions } from "./resources/user";
import bcrypt from "bcrypt"

AdminJS.registerAdapter({ Database, Resource })

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
            resource: {model: getModelByName("Users"), client: prisma},
            options: userResourceOptions
        }
    ],
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
    }
})

export const adminJrRouter = AdminJsExpress.buildAuthenticatedRouter(adminJs,{
    authenticate: async (email, password)=>{
     const user = await prisma.users.findUnique({where: {email}})
        
        if(user && user.role === "admin"){
            const matched = await bcrypt.compare(password, user.password)

            if(matched) return user
        }
        return false
    },
    cookiePassword: "senha-do-cookie"
}, null, {
    resave: false,
    saveUninitialized: false
});


// export const adminJrRouter = AdminJsExpress.buildRouter(adminJs)




