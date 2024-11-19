const commentSchema = require("../models/commentSchema");

//Create Comment
const addComment = async (req, res) => {
  try {
    let newComment = await commentSchema.create({ ...req.body });
    let saveComment = await newComment.save();

    res.status(201).json({
      success: true,
      message: "Comment successfully created.",
      innerData: saveComment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//Get all comments count
const allComments = async (req, res) => {
  try {
    const totalComments = await commentSchema.countDocuments({});
    res.status(200).json({
      success: true,
      message: "Totol comments count",
      innerData: totalComments,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: "Server Error" });
  }
};

module.exports = { addComment, allComments };
