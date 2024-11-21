export interface User {
    id: number
    firstName: string
    lastname: string
    phone: string
    birth: Date
    email: string
    password: string
    role: "admin" | "user"
}