import { Router } from "express";
import {
  changeAvatar,
  changeCoverImage,
  changeDetails,
  changePassword,
  loginUser,
  logoutUser,
  refereshAccessToken,
  registerUser,
} from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import { VerifyJWT } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "cover",
      maxCount: 1,
    },
  ]),
  registerUser
);

userRouter.route("/login").post(loginUser);
userRouter.route("/logout").post(VerifyJWT, logoutUser);
userRouter.route("/new-token").post(refereshAccessToken);

//change user
userRouter.route("/change/password").post( VerifyJWT, changePassword);
userRouter.route("/change/details").post(VerifyJWT, changeDetails);
userRouter.route("/change/avatar").post(VerifyJWT, upload.single("avatar"), changeAvatar);
userRouter.route("/change/cover-image").post(VerifyJWT, upload.single("cover", changeCoverImage));

export default userRouter;
