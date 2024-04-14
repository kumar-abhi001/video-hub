import mongoose, { Schema } from "mongoose";

const videosSchema = new Schema(
  {
    videoFile: {
      type: String,
      require: true,
    },
    thumbnail: {
      type: String,
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: "Users",
        require: true,
      unique: true
    },
    title: {
      type: String,
      require: true,
    },
    description: {
      type: String,
    },
    duration: {
      type: Number,
    },
    views: {
        type: Number,
        default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true
    },
  },
  { timestamps: true }
);

export const Videos = mongoose.model("Videos", videosSchema);
