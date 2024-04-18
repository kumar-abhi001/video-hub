import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const usersSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    avatar: {
      type: String, // Cloudinary URL
      required: true,
    },
    coverImage: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    refreshToken: {
      type: String,
    },
    watchHistory: [{
      type: Schema.Types.ObjectId,
      ref: "videos",
    }],
  },
  { timestamps: true }
);

// adding middleware to update our hashed password when password is updated
usersSchema.pre("save", async function (next) {
  if (this.isModified("password") === true) {
    try {
      this.password = await bcrypt.hash(this.password, 10);
    } catch (error) {
      console.log("ERROR in password hashing: ", error);
    }
  }
  next();
});

//method to check password is correct or not
usersSchema.methods.checkPassword = async function (password) {
  return bcrypt.compare(password, this.password); // return boolean value
}

//generate access token
usersSchema.methods.generateAccessToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
  )
}

//adding method to creating refresh token
usersSchema.methods.generateRefreshToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
  )
}



export const Users = mongoose.model("Users", usersSchema);
