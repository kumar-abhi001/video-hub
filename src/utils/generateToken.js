import jwt from "jsonwebtoken";

const generateToken = (payloadData) => {
  return jwt.sign(
    //payload
    {
      username: payloadData.username,
      password: payloadData.password,
      email: payloadData.email,
    },
    payloadData.secretToken,
    {
      expiresIn: payloadData.expiryTime,
    }
  );
};

export { generateToken };
