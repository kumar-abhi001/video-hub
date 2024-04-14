import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const usersSchema = new Schema(
  {
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "videos",
      },
    ],
    username: {
      type: String,
      require: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    fullName: {
      type: String,
      require: true,
      unique: true,
    },
    avatar: {
      type: String, //cloudnary url
      require: false,
      unique: false,
    },
    coverImage: {
      type: String,
      require: false,
      unique: false,
    },
    password: {
      type: String,
      require: [true, "Password is required."],
      unique: false,
    },
    refreshToke: {
      type: String,
    },
  },
  { timestamps: true }
);

// adding middleware to update our hashed password when password is updated
usersSchema.pre("save", async function (next) {
  if (this.isModified("password") === true) {
    try {
      const saltRound = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, saltRound);
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
usersSchema.methods.generateRefreshToken = async function () {
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
      password: this.password
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
  )
}



export const Users = mongoose.model("Users", usersSchema);
