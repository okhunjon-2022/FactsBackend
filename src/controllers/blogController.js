const BlogSchema = require("../models/BlogSchema");
const CommentSchema = require("../models/commentSchema");

//Get All Category
const allBlogs = async (req, res) => {
  try {
    const { search, category, location } = req.query;

    let query = {};

    if (search) {
      query = {
        ...query,
        $or: [
          { title: { $regex: search, $options: "i" } },
          { content: { $regex: search, $options: "i" } },
        ],
      };
    }

    if (category) {
      query = {
        ...query,
        category,
      };
    }
    if (location) {
      query = {
        ...query,
        location,
      };
    }

    let blogs = await BlogSchema.find(query)
      .populate("author", "email")
      .sort({ createAt: -1 });

    res.status(200).json({
      success: true,
      message: "All blogs are found.",
      innerData: blogs,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: "Server Error" });
  }
};

//Create Blog
const addBlog = async (req, res) => {
  try {
    // const { name } = req.body;
    let newBlog = await BlogSchema.create({ ...req.body, author: req.userId }); //Use  ,when you have tokenVerify

    let saveBlog = await newBlog.save();

    res.status(201).json({
      success: true,
      message: "Blog successfully created.",
      innerData: saveBlog,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//Get Blog By ID
const getBlogById = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await BlogSchema.findById(postId);

    // Blog mavjudligini tekshirish
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Blog is not found" });
    }

    const comments = await CommentSchema.find({ postId: postId }).populate(
      "user",
      "username email"
    );

    res.status(200).json({
      post,
      comments,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

//Update Blog
const updateBlog = async (req, res) => {
  try {
    let updateBlog = await BlogSchema.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
      },
      { new: true }
    );

    if (!updateBlog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog is not found." });
    }

    res.status(200).json({
      success: true,
      message: "Blog is updated successfully.",
      innerData: updateBlog,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, msg: "Server Error" });
  }
};

//Delete Blog
const deleteBlog = async (req, res) => {
  const { id } = req.params;
  try {
    let deleteBlog = await BlogSchema.findByIdAndDelete(id);

    if (!deleteBlog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog is not found" });
    }

    //delete related comments
    await CommentSchema.deleteMany({ postId: id });

    res.status(200).json({
      success: true,
      message: "Blog is deleted successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, msg: "Server Error" });
  }
};

//Releted Blogs
const getReletedBlog = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Blog is required" });
    }

    const blog = await BlogSchema.findById(id);

    // Blog mavjudligini tekshirish
    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog is not found" });
    }

    const titleRegex = new RegExp(blog.title.split(" ").join("|"), "i");

    const reletedQuery = {
      _id: { $ne: id }, //exclude the current blog by id
      title: { $regex: titleRegex },
    };

    const reletedBlog = await BlogSchema.find(reletedQuery);

    res.status(200).json({
      success: true,
      message: "Releted blog is found successfully",
      innerData: reletedBlog,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = {
  allBlogs,
  addBlog,
  getBlogById,
  updateBlog,
  deleteBlog,
  getReletedBlog,
};
