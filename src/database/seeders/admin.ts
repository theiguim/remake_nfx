import { prisma } from ".."
import bcrypt from 'bcrypt'

async function createAdmin() {

    await prisma.users.create({
        data: {
            firstName: 'Admin',
            lastName: 'User',
            phone: '555-5555',
            birth: '1990-01-01',
            email: 'admin@email.com',
            password: bcrypt.hashSync("12345", 10),
            role: 'admin',
        }
    })
}

createAdmin()