// import mongoose from "mongoose";
const mongoose = require("mongoose")


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    userName : {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false 
    },
    verificationToken: {type: String},
    profilePicture: {
        type: String,
        default: "userDefault.png"
    },
    readingList: {
        type: Array,
    },
    accessToken: String,
    about: String,
    websiteURL: String,
    githubURL: String,
    linkedinURL: String,
    xURL: String

},
{ timestamps: true }
);

// export const user = mongoose.model(user, "userSchema")
module.exports = mongoose.model("User", userSchema)