import { AuthenticationOptions } from "@adminjs/express"
import { prisma } from "../database"
import bcrypt from "bcrypt"

export const authenticationOptions: AuthenticationOptions = {
    authenticate: async (email, password) => {
        const user = await prisma.users.findUnique({ where: { email } })

        if (user && user.role === "admin") {
            const matched = await bcrypt.compare(password, user.password)

            if (matched) return user
        }
        return false
    },
    cookiePassword: "senha-do-cookie"
}