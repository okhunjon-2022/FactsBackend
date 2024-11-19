const jwt = require("jsonwebtoken");
const userSchema = require("../models/userSchema");

const generateAuthtoken = async (userId) => {
  try {
    const user = await userSchema.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1hr",
      }
    );
    return token;
  } catch (error) {
    console.error("Error generation token", error);
  }
};

module.exports = generateAuthtoken;
