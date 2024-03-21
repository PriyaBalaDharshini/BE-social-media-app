import mongoose from "mongoose";

const PostSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        max: 500
    },
    img: {
        type: String
    },
    likes: {
        type: Array,
        default: []
    }
},
    { timestamps: true }
)

const UserModel = mongoose.model("Post", PostSchema);
export default UserModel;