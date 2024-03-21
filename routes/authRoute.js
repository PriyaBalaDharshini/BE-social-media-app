import express from "express";
import userController from "../controllers/userController.js";

const router = express.Router()

//Regiester
router.post("/register", userController.registerUser)
router.post("/login", userController.login)

export default router