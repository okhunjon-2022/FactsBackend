const express = require("express");
const {
  allBlogs,
  addBlog,
  getBlogById,
  updateBlog,
  deleteBlog,
  getReletedBlog,
} = require("../controllers/blogController");
const verifyToken = require("../middlewares/verifyToken");
const isAdmin = require("../middlewares/isAdmin");

const blogRouter = express.Router();

blogRouter.get("/:id", getBlogById);
blogRouter.delete("/delete/:id", verifyToken, isAdmin, deleteBlog);
blogRouter.get("/", allBlogs);
blogRouter.post("/add", verifyToken, isAdmin, addBlog);
blogRouter.put("/update/:id", verifyToken, isAdmin, updateBlog);
blogRouter.get("/related/:id", getReletedBlog);

module.exports = blogRouter;
