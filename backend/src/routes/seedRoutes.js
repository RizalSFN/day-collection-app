import express from "express";
import { seedUsers } from "../../seeds/seedUsers.js";

const seedRoutes = express.Router();

seedRoutes.post("/seed", async (req, res) => {
    try {
        // proteksi sederhana
        if (req.query.key !== process.env.SEED_KEY) {
            return res.status(403).json({ message: "Forbidden" });
        }

        const result = await seedUsers();

        res.json({
            success: true,
            message: result,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

export default seedRoutes;
