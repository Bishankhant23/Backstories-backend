import express from "express";
import { auth } from "../middlewares/auth.middleware.js";
import { getMySeasons,getMyEpisodesBySeason,getOtherUserProfile,searchUsers } from "../controllers/user.controller.js";


const router = express.Router();

// GET /api/users/me
router.get("/seasons", auth,getMySeasons );
router.get("/episodes/:seasonId", auth,getMyEpisodesBySeason );
router.get("/search", auth,searchUsers );
router.get("/:userId", auth,getOtherUserProfile );

export default router;