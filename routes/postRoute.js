import express from 'express'
import postController from '../controllers/postController.js'

const router = express.Router()
router.post("/", postController.createPost)
router.put("/:id", postController.updatePost)
router.delete("/:id", postController.deletePost)
router.put("/:id/like-dislike", postController.likePost)
router.get("/:id", postController.getPost)
router.get("/timeline/all", postController.timelinePost)

export default router