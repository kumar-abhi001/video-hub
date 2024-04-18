import { ApiError } from "../utils/errorHandler.js";
import jwt from "jsonwebtoken";
//Authentication
export const VerifyJWT = async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header?.("Authorization")?.replace("Bearer ", "");

  if (!token) {
    res.send(new ApiError(401, "Unauthorized access"));
  }

  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  req._id = decodedToken._id;
  console.log(decodedToken);

  next();
};
