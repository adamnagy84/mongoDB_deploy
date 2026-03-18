import jwt from "jsonwebtoken";

export const requireAuth = (req, res, next) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    res.status(401).json({ message: "Not authenticated." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return req.status(401).json({ message: "Invalid or expired token." });
  }
};
