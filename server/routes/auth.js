import express from "express";
import { signup, login, savePhoneUser } from "../controllers/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/phone-auth", savePhoneUser); 

export default router;
