import User from "../models/User.js"; // Your Mongoose User model

export const isAdmin = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
