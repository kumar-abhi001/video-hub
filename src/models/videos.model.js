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
      require: true,
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
      require: true,
    },
    views: {
      type: Number,
    },
    isPublished: {
      type: Boolean,
      require: true,
    },
  },
  { timestamps: true }
);

export const Videos = mongoose.model("Videos", videosSchema);
