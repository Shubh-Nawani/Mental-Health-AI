import jwt from 'jsonwebtoken';
import { logError } from '../utils/logger.js';

export const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: "Authentication required" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ error: "Invalid token" });
      }
      req.user = user;
      next();
    });
  } catch (error) {
    logError("Auth Middleware Error:", error);
    res.status(500).json({ error: "Authentication failed" });
  }
};