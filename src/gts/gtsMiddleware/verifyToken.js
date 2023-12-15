// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    jwt.verify(token, "your-secret-key", (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "Invalid token" });
      }

      req.userId = decoded.userId;
      next();
    });
    return res.status(200).json({ message: "Success" });
  } catch (error) {
    return res.status(404).json({ error });
  }
};

module.exports = { verifyToken };
