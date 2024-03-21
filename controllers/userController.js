import User from '../models/UserModel.js'
import bcrypt from 'bcrypt'

// Register
const registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const salt = await bcrypt.genSalt(8);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.status(200).send({
            message: "User Registered Successfully",
            newUser
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error");
    }
}
//Get all users
const getAllUsers = async (req, res) => {
    try {
        let users = await User.find()
        res.status(200).send({
            message: "User data fetch successful",
            users
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Internal Server Error"
        })
    }
}

// Login
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send("User Not Found");
        }

        const passwordValidate = await bcrypt.compare(password, user.password);
        if (!passwordValidate) {
            return res.status(401).send("Incorrect Password");
        }

        res.status(200).send({
            message: "Login Successfull",
            user
        })

    } catch (error) {
        console.log(error);
        res.status(500).send("Invalid Credentials");
    }
}

//Update user
const updateUser = async (req, res) => {
    try {
        // Check if the user can update the details
        if (req.body.userId === req.params.id || req.body.isAdmin) {
            // Hash the password if provided
            if (req.body.password) {
                const salt = await bcrypt.genSalt(8);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            }
            // Update the user details and return the updated document
            const user = await User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
            res.status(200).send({
                message: "User details updated successfully",
                user
            });
        } else {
            res.status(401).send("You can upadate only your Account");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

//Delete user
const deleteUser = async (req, res) => {
    try {
        // Check if the user can delete the details
        if (req.body.userId === req.params.id || req.body.isAdmin) {
            //const user = await User.deleteOne({ _id: req.params.id });
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).send({
                message: "User details Deleted successfully",
            });
        } else {
            res.status(401).send("You can Delete only your account");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

//Get a user by id
const getUserById = async (req, res) => {
    try {

        const user = await User.findById(req.params.id);
        const { password, updatedAt, ...others } = user._doc;
        res.status(200).send({
            message: "User details fetched successfully",
            user: others
        })
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}

//Follow a user
const followeUser = async (req, res) => {
    if (req.body.userId !== req.params.id) { // Check if the userId in the request body is not equal to the id in the request parameters
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if (!user.followers.includes(req.body.userId)) {
                await user.updateOne({ $push: { followers: req.body.userId } })
                await currentUser.updateOne({ $push: { followings: req.params.id } })
                res.status(200).send("User Followed Successfully")
            } else {
                res.status(403).send("You are already following this user")
            }
        } catch (error) {
            res.status(500).send(error);
        }
    } else {
        res.status(403).send("You can't follow yourself")
    }
}

//Follow a user
const unfolloweUser = async (req, res) => {
    if (req.body.userId !== req.params.id) { // Check if the userId in the request body is not equal to the id in the request parameters
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({ $pull: { followers: req.body.userId } })
                await currentUser.updateOne({ $pull: { followings: req.params.id } })
                res.status(200).send("User Unfollowed Successfully")
            } else {
                res.status(403).send("You are not following this user")
            }
        } catch (error) {
            res.status(500).send(error);
        }
    } else {
        res.status(403).send("You can't unfollow yourself")
    }
}



export default {
    registerUser,
    login,
    updateUser,
    deleteUser,
    getUserById,
    getAllUsers,
    followeUser,
    unfolloweUser
}
