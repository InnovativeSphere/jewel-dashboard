import jwt from "jsonwebtoken";
import cookie from "cookie";

export function verifyToken(req) {
  let token = null;

  const authHeader = req.headers.authorization || "";
  if (authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token && req.headers.cookie) {
    const cookies = cookie.parse(req.headers.cookie);
    token = cookies.token;
  }

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { ...decoded, role: decoded.role || "user" };
  } catch (err) {
    console.warn("JWT verification failed:", err.message);
    return null;
  }
}
