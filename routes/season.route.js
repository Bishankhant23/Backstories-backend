import express from "express"
import { deleteSeason,addSeason } from "../controllers/season.controller.js"
import { auth } from "../middlewares/auth.middleware.js"

const router = express.Router()
router.delete("/:seasonId",auth,deleteSeason)
router.post("/",auth,addSeason)

export default router
