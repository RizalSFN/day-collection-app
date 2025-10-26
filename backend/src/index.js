import app from "./app.js";
import prisma from "./config/db.js";
import dotenv from "dotenv";

dotenv.config()

const PORT = process.env.PORT || 5000

async function startServer() {
    try {
        await prisma.$connect()
        console.log("Database connected succesfully");

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        })
    } catch (error) {
        console.log("Failed to connect to database", error);
        process.exit(1)
    }
}

startServer()
