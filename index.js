const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db");
const blogRouter = require("./src/routes/blogRoute");
const commentRouter = require("./src/routes/commentRoute");
const userRouter = require("./src/routes/userRoute");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

//app config
const app = express();
dotenv.config();
//Middleware
app.use(express.json());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "https://factreality.netlify.app",
    credentials: true, //enable set cookie
  })
);

connectDB();

//api endpoints
app.use("/api/blogs", blogRouter);
app.use("/api/comment", commentRouter);
app.use("/api/user", userRouter);

app.get("/", (req, res) => {
  res.send("Backend is running.");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server Started on http://localhost:${PORT}`);
});
