import express from "express";
import { loginUser, logoutUser, registerUser ,getMyProfile} from "../controllers/auth.controller.js";


const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/me", getMyProfile);

export default router;
