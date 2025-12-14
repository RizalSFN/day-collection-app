import app from "./app.js";
import prisma from "./config/db.js";
import dotenv from "dotenv";

dotenv.config()

const PORT = process.env.PORT || 5000

async function startServer(retries = 5) {
    try {
        await prisma.$connect()
        console.log("Database connected succesfully");

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        })
    } catch (error) {
        if (retries > 0) {
            console.log(`Retrying database connection... (${retries})`);
            setTimeout(() => startServer(retries - 1), 5000);
        } else {
            console.error("Could not connect to database. Exiting.");
            process.exit(1);
        }
    }
}

startServer()
