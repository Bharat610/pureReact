const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    desc: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
        required: false
    },
    userDetails: {
        userName:{type: String, required: true},
        userPhoto: {type: String, required: true}
    },
    likes: {
        type: Array,
    },
    likesCount: {
        type: Number,
        default: 0
    },
    comments: {
        type: Array,
    },
    categories: {
        type: Array,
        required: false,
    }
},
{ timestamps: true }
);

// export const post = mongoose.model(post, "postSchema")
module.exports = mongoose.model("Post", postSchema)