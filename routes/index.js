import express from "express";
import authRoutes from "./auth.route.js"
import userRoutes from "./user.route.js"
import episodesRoutes from "./episodes.route.js"
import seasonRoutes from "./season.route.js"

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/episode", episodesRoutes);
router.use("/season", seasonRoutes);


export default router;
