const express = require("express");
const UserModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
const router = express.Router();
//register
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  console.log(name, email, password);
  const hash = await argon2.hash(password);
  try {
    const user = new UserModel({ name, email, password: hash });
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
  const user = await UserModel.findOne({ email });
  console.log(user, password);
  try {
    if (user) {
      if (
        user.password == password ||
        (await argon2.verify(user.password, password))
      ) {
        const token = jwt.sign(
          { id: user._id, name: user.name, email: user.email },
          "SECRET",
          { expiresIn: "24 hours" }
        );
        const refreshToken = jwt.sign(
          { id: user._id, name: user.name, email: user.email },
          "REFRESH",
          { expiresIn: "7 days" }
        );
        return res
          .status(201)
          .send({ message: "login sucess", token, refreshToken, user });
      } else {
        return res.status(401).send("wrong credentials");
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(401).send(error.message);
  }
});

//update
router.put("/:id", async (req, res) => {
  let token = req.headers["authorization"];
  if (token) {
    const decoded = jwt.decode(token);

    if (decoded.id == req.params.id) {
      console.log(req.params.id, req.body.creds);
      try {
        const updateUser = await UserModel.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body.creds,
          },
          { new: true }
        );
        res.status(200).send(updateUser);
      } catch (e) {
        res.status(401).send("you can update only your account");
      }
    }
  }
});

//delete
router.delete("/:id", async (req, res) => {
  let token = req.headers["authorization"];

  if (token) {
    const decoded = jwt.decode(token);

    if (decoded.id === req.params.id) {
      console.log(decoded.id);
      try {
        await UserModel.findByIdAndDelete(req.params.id);
        return res.status(200).send("account deleted");
      } catch (e) {
        return res.send(e.message);
      }
    } else {
      return res.status(401).send("you can only delete your account");
    }
  }
});

//Get
router.get("/:id", async (req, res) => {
  const token = req.headers["authorization"];
  if (token) {
    const decoded = jwt.decode(token);
    if (decoded.id == req.params.id) {
      try {
        const user = await UserModel.findById(req.params.id);
        const { password, ...others } = user._doc;
        return res.send(others);
      } catch (e) {
        res.status(500).send(e.message);
      }
    }
  }
});

module.exports = router;
