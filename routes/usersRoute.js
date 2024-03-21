import express from "express";
import userController from "../controllers/userController.js";

const router = express.Router()

router.get("/all", userController.getAllUsers);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
router.get("/:id", userController.getUserById);
router.put("/:id/follow", userController.followeUser);
router.put("/:id/unfollow", userController.unfolloweUser);


export default router