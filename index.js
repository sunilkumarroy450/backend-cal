require("dotenv").config();
const express = require("express");
// const mongoose=require('mongoose');
// mongoose.set('strictQuery', false);
const connection = require("./config/db");
const cors = require("cors");
const UserRouter = require("./routes/user.route");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use("/users", UserRouter);

app.listen(process.env.PORT, async () => {
  await connection;
  console.log(`Server started on ${process.env.PORT}`);
});
