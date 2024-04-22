import { ApiError } from "../utils/errorHandler.js";
import jwt from "jsonwebtoken";
import { Users } from "../models/users.model.js";
//Authentication
export const VerifyJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header?.("Authorization")?.replace("Bearer ", "");
  
    if (!token) {
      throw new ApiError(401, "Unauthorized access");
    }
  
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decodedToken) {
      throw new ApiError(401, "Unauthorized Access");
    }

    const user = await Users.findById(decodedToken._id).selectr("-refreshToken -password");
    req.user = user;
    next();
  } catch (error) {
    res.send(new ApiError(401, "Error in authenticaton"));
  }
};
