const express = require("express");
const UserModel = require("../models/user.model");
const router = express.Router();
//register
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  console.log(name, email, password);
  try {
    const user = new UserModel({ name, email, password });
    await user.save();
    return res.status(201).send("User Created Successfully");
  } catch (error) {
    console.log(error.message);
    return res.send(error.message);
  }
});

//login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  const user = await UserModel({ email, password });
  if (user) {
    return res.status(201).send({ message: "Login Successful" });
  } else {
    return res.status(401).send("Invalid Credentails");
  }
});

module.exports = router;
