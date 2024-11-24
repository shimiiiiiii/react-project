const User = require('../models/user')
const jwt = require("jsonwebtoken")

exports.isVerified = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decode token
    console.log("Decoded Token:", decoded);

    // Fetch the user from the database
    const user = await User.findById(decoded.id);
    console.log("Fetched User:", user);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (!user.isVerified) {
      console.log("User isVerified Status:", user.isVerified);
      return res.status(403).json({ message: "User email is not verified." });
    }

    // Attach user object to req.user
    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication Error:", error.message);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};


exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
          return res.status(403).json({
              success: false,
              message: `Role (${req.user.role}) is not authorized to perform this action.`,
          });
      }
      next();
  };
};


exports.verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("Authorization Header:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];
  console.log("Extracted Token:", token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded);

    // Find the user from the database
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    console.log("User ID:", user.id);
    console.log("User Name:", user.name);

    req.user = { id: user.id, name: user.name }; // Attach user info to the request
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token." });
  }
};


exports.authenticateUser = (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach the decoded user information
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};
