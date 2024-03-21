import Post from '../models/PostModel.js'
import User from '../models/UserModel.js'

//Create a post
const createPost = async (req, res) => {
    const newPost = new Post(req.body);
    try {
        const savePost = await newPost.save();
        res.status(200).send({
            message: "Post created Successfully",
            savePost
        })
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error")
    }
}

//update post
const updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.updateOne({ $set: req.body })
            res.status(200).send({
                message: "Post update Successfully",
                post
            })
        } else {
            res.status(403).send("You can update you post only")
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error")
    }
}

//delete post
const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (post.userId === req.body.userId) {
            await post.deleteOne()
            res.status(200).send("Post has been deleted.")
        } else {
            res.send(403).send("You can delete only your post")
        }

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error")
    }
}
//like and dislike a post
const likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post.likes.includes(req.body.userId)) {
            await Post.updateOne({ $push: { likes: req.body.userId } })
            res.status(200).send("You like this post")
        } else {
            await Post.updateOne({ $pull: { likes: req.body.userId } })
            res.status(200).send("You disliked this post")
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error")
    }
}

//get a post
const getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).send(post)

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error")
    }
}

//get time line post
const timelinePost = async (req, res) => {
    try {
        const currentUser = await User.findById(req.body.userId);
        const userPosts = await Post.find({ userId: currentUser._id })
        const friendPosts = await Promise.all(
            currentUser.followings.map((friendId) => {
                return Post.find({ userId: friendId })
            })
        )
        res.json(userPosts.concat(...friendPosts))

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error")
    }
}


export default {
    createPost,
    updatePost,
    deletePost,
    likePost,
    getPost,
    timelinePost
}