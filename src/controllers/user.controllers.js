import { asyncHandler } from "../utils/asyncHandler.js";
import { Users } from "../models/users.model.js";
import { ApiError } from "../utils/errorHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const registerUser = asyncHandler(async (req, res) => {
    const { username, fullname, email, password } = req.body;
    if (!username || !fullname || !email || !password) {
        console.log(req.body);
        throw new ApiError(409, "All fields are required");
    }

    const userExist = await Users.findOne(
        {
            $or: [{ username }, { email }]
        }
    )

    if (userExist) {
        throw new ApiError(409, "Username or email already exist");
    }

    const avatar = req.files?.avatar[0]?.path;
    const cover = req.files?.cover[0].path;

    const avatarResponse = await uploadOnCloudinary(avatar);
    const coverResponse = await uploadOnCloudinary(cover);

    res.send({
        message: "user registerred",
        hi: "hi there",
        avatar: avatarResponse,
        cover: coverResponse
    })
});
