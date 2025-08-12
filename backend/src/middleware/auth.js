import { verifyToken } from "../utils/jwt.js";

export const authenticate = (req, res, next) => {
  const token = req.cookies.session;

  if (!token) {
    return res.status(401).json({ error: "No authentication token provided" });
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  req.user = decoded;
  next();
};
