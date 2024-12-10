import { z } from "zod";

const RoleEnum = z.enum(["admin", "user"]);

export const userSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    phone: z.string(),
    birth: z.string(),
    email: z.string(),
    password: z.string(),
    role: RoleEnum.default("user").optional()
})

export const updatedUser = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phone: z.string().optional(),
    birth: z.string().optional(),
    email: z.string().optional(),
})

export const updatePassword = z.object({
    password: z.string()
})