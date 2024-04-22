import { asyncHandler } from "../utils/asyncHandler.js";
import { Users } from "../models/users.model.js";
import { ApiError } from "../utils/errorHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";

//Register controlller logic
const registerUser = asyncHandler(async (req, res) => {
  const { username, fullName, email, password } = req.body;
  if (!username || !fullName || !email || !password) {
    throw new ApiError(409, "All fields are required");
  }

  //Find if user already exist
  const userExist = await Users.findOne({
    $or: [{ username }, { email }],
  });

  if (userExist) {
    throw new ApiError(409, "Username or email already exist");
  }
  const avatarLocalPath = req.files?.avatar[0]?.path;
  let coverLocalPath;
  if (req.files && Array.isArray(req.files.cover) ) {
    coverLocalPath = req.files.cover[0].path;
  }

  //getting the url of avatar and cover
  console.log("cover: ", coverLocalPath);
  const avatarUrl = await uploadOnCloudinary(avatarLocalPath); // from middleware itself url is sended
  const coverUrl = await uploadOnCloudinary(coverLocalPath);

  //adding user details into our database referesh token create by method
  const user = await Users.create({
    fullName,
    avatar: avatarUrl,
    coverImage: coverUrl,
    email,
    password,
    username: username.toLowerCase(),
    refreshToken: "",
  });

  //Getting user data for response without password and refreshToken
  const createdUser = await Users.findById(user._id).select(
    "-password -refreshToken"
  );
  res.send(new apiResponse(202, createdUser, "User is register successfully"));
});

//login logic
const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.send(new ApiError(401, "All fields are required!"));
  }

  const user = await Users.findOne({ username });
  //check password is correct or not
  const isPasswordValid = await user.checkPassword(password);

  if (!isPasswordValid) {
    res.send(new ApiError(401, "Invalid user credentials!")); //if password is wrong
  }

  const refreshToken = await user.generateRefreshToken();
  const accessToken = await user.generateAccessToken();

  //adding our refreshToken to our database
  user.refreshToken = refreshToken;
  user.save();

  const loggedInUser = await Users.findById(user._id).select(
    "-password -refreshToken"
  );
  console.log(loggedInUser);
  //create options for cookie
  const option = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(202)
    .cookie("accessToken", accessToken, option)
    .cookie("refreshToken", refreshToken, option)
    .send(new apiResponse(202, loggedInUser, "User is logged-in"));
});

//log-out logic
const logoutUser = asyncHandler(async (req, res) => {
  //add middleware to verify the accessToken or refreshToken
  //then find the user with given
  const user = await Users.findById(req._id);
  user.refreshToken = "";
  user.save();

  const option = {
    httpOnly: true,
    secure: true,
  };

  res
    .clearCookie("refreshToken", option)
    .clearCookie("accessToken", option)
    .send(new apiResponse(204, "", "User is logged-out"));
});

//Refresh Access Token
const refereshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies?.refereshToken || req.header?.("Authorization")?.replace("Bearer ", "");;

  //No incoming refresh token
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized Access");
  }

  //Decode the refresh token
  const decodedRefreshToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
  
  //If not decoded
  if (!decodedRefreshToken) {
    throw new ApiError(401, "Token is incorrect");
  }

  //find user with decoded details
  const user = await Users.findById(decodedRefreshToken._id);
  
  if (!user) {
    throw new ApiError(401, "User not found");
  }

  //check database refreshToken with request refreshToken
  if (user.refreshToken !== incomingRefreshToken) {
    throw new ApiError(404, "Invalid refreshToken");
  }
  
  //generate new token
  const accessToken = await user.generateAccessToken();
  const newRefreshToken = await user.generateRefreshToken();

  user.refreshToken = newRefreshToken;
  user.save();
  
  const userDetail = await Users.findById(user._id).select("-password, -refreshToken");

  //option for setting cookies
  const option = {
    httpOnly: true,
    secure: true
  }

  return res.status(202)
    .clearCookie("refreshToken", option)
    .cookie("refreshToken", newRefreshToken, option)
    .cookie("accessToken", accessToken, option)
    .send(new apiResponse(202, userDetail, "Token are refreshed"));

});

/****************  Settings for user  **************/
//change password of user
const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await Users.findById(req.user?._id); // middleware added _id to req

  if (!user) {
    throw new ApiError(404, "User not found!");
  }

  const isPasswordValid = await user.checkPassword(oldPassword);
  if (!isPasswordValid) {
    throw new ApiError(401, "Incorrect Old Password");
  }

  user.password = newPassword;
  user.save();

  res.status(200).send(new apiResponse(200, "", "Password is changed successfully"));

});

//change name
const changeDetails = asyncHandler(async (req, res) => {
  const { name, email } = req.body;
  const user = Users.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        name,
        email
      }
    },
    {
      new: true
    }
  ).select("-password -refreshToken");

  return res
    .status(202)
    .send(new apiResponse(202, user, "Account detail is updated"));
});

//change user avatar
const changeAvatar = asyncHandler(async (req, res) => {
  const newAvatarLocalPath = req.files?.avatar[0]?.path;
  if (!newAvatarLocalPath) {
    throw new ApiError(400, "Avatar path not able for update");
  }

  const newAvatarUrl = uploadOnCloudinary(newAvatarLocalPath);
  const user = Users.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        avatar: newAvatarUrl
      }
    },
    {
      new: true
    }
  ).select("-password -refreshToken");

  return res.status(202)
    .send(new apiResponse(202, user, "Avatar is updated successfully"));
});

//change cover image
const changeCoverImage = asyncHandler(async (req, res) => {
  const newCoverLocalPath = req.files?.cover[0]?.path;
  if (!newCoverLocalPath) {
    throw new ApiError(400, "Avatar path not able for update");
  }

  const newCoverUrl = uploadOnCloudinary(newCoverLocalPath);
  const user = Users.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        coverImage: newCoverUrl
      }
    },
    {
      new: true
    }
  ).select("-password -refreshToken");

  return res.status(202)
    .send(new apiResponse(202, user, "Avatar is updated successfully"));
});

// get channel information

const getUserChannelProfile = asyncHandler(async (req, res) => {
  //get the user or channel from query params
  const { username } = req.params;

  if (!username?.trim()) {
    throw new ApiError(400, "Username is missing in channel profile.");
  }

  const channel = await Users.aggregate([
    //stage 1 matching the username in users database
    {
      $match: {
        username: username?.toLowerCase()
      }
    },

    //stage 2 - number of subscribers of channel
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscriber"
      }
    },

    //stage 3 - number of channel this channel is subscribed
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "channel"
      }
    },

    {
      $addFields: {
        subscribersCount: {
          $size: "$subscribers"
        },
        channelsSubscribedToCount: {
          $size: "$subscribedTo"
        },
        isSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
            then: true,
            else: false
          }
        }
      }
    },
    {
      $project: {
        fullName: 1,
        username: 1,
        subscribersCount: 1,
        channelsSubscribedToCount: 1,
        isSubscribed: 1,
        avatar: 1,
        coverImage: 1,
        email: 1

      }
    }
  ])

  if (!channel?.length) {
    throw new ApiError(400, "Channel doesn't exit");
  }

  res.status(200)
    .json(new apiResponse(200, channel[0], "User channel fetched successfully:)"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refereshAccessToken,
  changePassword,
  changeDetails,
  changeAvatar,
  changeCoverImage,
  getUserChannelProfile
};
