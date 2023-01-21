const mongoose = require("mongoose");
mongoose.set('strictQuery', false);
require("dotenv").config();
const connection = mongoose
.connect(process.env.MONGO_URL)
.then(() => console.log("Connected to Database"))
.catch((err) => console.log(err));

module.exports = connection;
