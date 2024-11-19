const userSchema = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const generateAuthToken = require("../middlewares/generateToken");

//Register
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validatsiya: kerakli tekshiruvlar
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Invalid data. username, email, and password are required.",
      });
    }

    //checking is user already exists
    const exists = await userSchema.findOne({ email });

    if (exists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    //Validating email format & strong password
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password.",
      });
    }

    //hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userSchema({
      username,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();

    // const token = user.generateAuthToken();

    res.status(201).json({
      success: true,
      message: "User successfully registered",
      //   token,
      user,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

//Login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userSchema.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User doesn't exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = await generateAuthToken(user._id);

    res.cookie("token", token, {
      httpOnly: true, //enable this only when you have https://
      secure: true,
      sameSite: true,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

//Logout a user
const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token");
    res
      .status(200)
      .json({ success: true, message: "Logged out successfully done" });
  } catch (error) {
    console.error("Failed to log out", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// Get all users
const allUsers = async (req, res) => {
  try {
    const users = await userSchema.find({}, "id email role");
    res
      .status(200)
      .json({ success: true, message: "Users found successfully", users });
  } catch (error) {
    console.error("Error fetching users", users);
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
};

//Delete a user
const removeUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userSchema.findByIdAndDelete(id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }

    res
      .status(200)
      .json({ success: true, message: "User deleted successfully!" });
  } catch (error) {
    console.error("Error deleting user", error);
    res.status(500).json({ success: false, message: "Error deleting user" });
  }
};

//Update a user role
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const user = await userSchema.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "User role updated successfully", user });
  } catch (error) {
    console.error("Error updating user role", error);
    res
      .status(500)
      .json({ success: false, message: "Failed updating user role." });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  allUsers,
  removeUser,
  updateUserRole,
};
