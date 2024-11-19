const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => console.log("MongoDb is connected successfully!"))
    .catch(() => console.log("MongoDb is not connected"));
};

module.exports = connectDB;
