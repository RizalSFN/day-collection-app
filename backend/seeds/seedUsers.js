import bcrypt from "bcrypt";
import prisma from "../config/db.js";

export async function seedUsers() {
    const users = [
        {
            name: "Admin",
            username: "admin",
            email: "admin@example.com",
            password: await bcrypt.hash("admin123", 10),
        },
    ];

    for (const user of users) {
        const exists = await prisma.users.findUnique({
            where: { email: user.email },
        });

        if (!exists) {
            await prisma.users.create({ data: user });
        }
    }

    return "Users seeded";
}
