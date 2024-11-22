import AdminJS from "adminjs"
import AdminJsExpress from "@adminjs/express"
//@ts-ignore
import { Database, Resource, getModelByName } from '@adminjs/prisma'
import { prisma } from "../database";
import { courseResourceFeature } from "./resources/course";
import { episodeResourceFeatures } from "./resources/episodes";
import { userResourceOptions } from "./resources/user";
import { dashboardOptions } from "./dashboard";
import { componentLoader } from "./components/componentLoader"
import { brandingOptions } from "./branding";
import { authenticationOptions } from "./authentication";

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
            resource: { model: getModelByName("Users"), client: prisma },
            options: userResourceOptions
        }
    ],
    dashboard: dashboardOptions,
    componentLoader,
    rootPath: "/admin",
    branding: brandingOptions
})

export const adminJrRouter = AdminJsExpress.buildAuthenticatedRouter(
    adminJs,
    authenticationOptions,
    null,
    {
        resave: false,
        saveUninitialized: false
    }
);


// export const adminJrRouter = AdminJsExpress.buildRouter(adminJs)




