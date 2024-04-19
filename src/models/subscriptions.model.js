import mongoose, { Mongoose, Schema } from "mongoose";

const subscriptionSchema = new Schema(
    {
        channel: {
            type: Schema.type.ObjectId,
            ref: "Users"
        },
        subscriber: {
            type: Schema.type.ObjectId,
            ref: "Users"
        }
    },
    { timestamps: true }
);

export const subscriptions = mongoose.model("subcriptions", subscriptionSchema);