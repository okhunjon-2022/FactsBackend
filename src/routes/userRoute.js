const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  allUsers,
  removeUser,
  updateUserRole,
} = require("../controllers/userController");

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logoutUser);
userRouter.get("/users", allUsers);
userRouter.delete("/:id", removeUser);
userRouter.put("/:id", updateUserRole);

module.exports = userRouter;
