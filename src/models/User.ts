export interface User {
    id: number
    firstName: string
    lastName: string
    phone: string
    birth: string
    email: string
    password: string
    role: "admin" | "user"
}