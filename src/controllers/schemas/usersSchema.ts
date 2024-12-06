import { z } from "zod";

export const userSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    phone: z.string(),
    birth: z.string(),
    email: z.string(),
    password: z.string(),
    role: z.string().default("user").optional()
})