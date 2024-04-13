import mongoose, { Schema } from "mongoose";

const usersSchema = new Schema(
    {
        watchHistory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "videos"
        },
        username: {
            type: String,
            require: true,
            unique: true,
        },
        email: {
            type: String,
            require: true,
            unique: true
        },
        fullName: {
            type: String,
            require: true,
            unique: true
        },
        avatar: {
            type: String,
            require: false,
            unique: false
        },
        coverImage: {
            type: String,
            require: false,
            unique: false
        },
        password: {
            type: String,
            require: true,
            unique: false
        },
        refreshToke: {
            type: String
        }
    },
    {timestamps: true}
)

export const Users = mongoose.model("Users", usersSchema);

