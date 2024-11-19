const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies.token;
    // const token = req.headers.authorization.split(" ")[1]; //Bareer Token
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.userId) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid token provided" });
    }

    req.userId = decoded.userId;
    req.role = decoded.role;
    next();
  } catch (error) {
    console.error("Error verify token", error);
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};

module.exports = verifyToken;
