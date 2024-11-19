const express = require("express");
const { addComment, allComments } = require("../controllers/commentController");

const commentRouter = express.Router();

commentRouter.get("/all", allComments);
commentRouter.post("/add", addComment);

module.exports = commentRouter;
