import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
   const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Token required' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Malformed token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["Authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
};

export { authMiddleware, authenticateToken };
