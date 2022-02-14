const User = require("../../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signUp = async (req, res, next) => {
  try {
    const { password, username } = req.body;
    console.log(
      "🚀 ~ file: controllers.js ~ line 8 ~ exports.signUp= ~ password",
      password,
      username
    );

    const saltRounds = 10;
    req.body.password = await bcrypt.hash(password, saltRounds);

    console.log(
      "🚀 ~ file: controllers.js ~ line 18 ~ exports.signUp= ~ req.body",
      req.body
    );
    const newUser = await User.create(req.body);
    console.log(
      "🚀 ~ file: controllers.js ~ line 17 ~ exports.signUp= ~ newUser",
      newUser
    );

    const payload = {
      _id: newUser._id,
      username: newUser.username,
      exp: Date.now() + process.env.EXPTIME,
    };
    const token = jwt.sign(JSON.stringify(payload), process.env.SECRETKEY);

    res.status(201).json({ token });
  } catch (error) {
    next(error);
  }
};
exports.signIn = async (req, res, next) => {
  try {
    const newUser = req.user;
    const payload = {
      _id: newUser._id,
      username: newUser.username,
      exp: Date.now() + +process.env.EXPTIME,
    };
    const token = jwt.sign(JSON.stringify(payload), process.env.SECRETKEY);

    res.status(201).json({ token });
  } catch (error) {
    next(error);
  }
};
