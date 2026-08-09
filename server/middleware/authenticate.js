import jwt from "jsonwebtoken";

export default async function authenticate(req, res, next) {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      return res.status(401).json({
        success: false,
        message: "Access Token Not Found",
      });
    }

    const token = authorization.split(" ");

    if (token[0] !== "Bearer" || !token[1]) {
      return res.status(401).json({
        success: false,
        message: "Access Token Not Found",
      });
    }

    const accessToken = token[1];

    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (err) {
    console.log(err.message);
    return res.status(401).json({
      success: false,
      message: "Authentication Failed",
    });
  }
}
