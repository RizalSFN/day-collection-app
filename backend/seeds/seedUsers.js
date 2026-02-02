import bcrypt from "bcrypt";
import prisma from "../src/config/db.js";

async function seedUsers() {
    console.log("Proses seeding dimulai...");
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
            console.log(`User ${user.email} berhasil dibuat.`);
        } else {
            console.log(`User ${user.email} sudah ada.`);
        }
    }
}

// PEMANGGILAN UTAMA (Sangat Penting)
seedUsers()
    .catch((e) => {
        console.error("Error saat seeding:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });