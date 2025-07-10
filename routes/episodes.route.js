import { addEpisode ,getEpisodeById,getEpisodesBySeason} from "../controllers/episodes.controller.js";
import express from "express"
import {auth} from "../middlewares/auth.middleware.js"
import upload from "../middlewares/upload.middleware.js";

const router = express.Router()

router.post("/add",auth,upload.array("photos"),addEpisode)
router.get("/:id",auth,getEpisodeById)
router.get("/list/:seasonId",auth,getEpisodesBySeason)


export default router