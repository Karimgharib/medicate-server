const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const generateToken = require("../config/generateToken");

// funcion for user registration
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, isPatient, specialization, about, pic } =
    req.body;

  if (!name || !email || !password || !isPatient) {
    res.status(400);
    throw new Error("Please Enter All Fields");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User Already Exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    isPatient,
    specialization,
    about,
    pic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isPatient: user.isPatient,
      specialization: user.specialization,
      about: user.about,
      pic: user.pic,
    });
  } else {
    res.status(400);
    throw new Error("User Not Found!");
  }
});

// function for user authentication and redirection based on user role
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isPatient: user.isPatient,
      specialization: user.specialization,
      about: user.about,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid Email or Password");
  }
});

// function for fetching doctors' data from Databse
const fetchDoctors = asyncHandler(async (req, res) => {
  const users = await User.find({ isPatient: false }).select(
    "name email specialization about pic"
  );
  return res.send(users);
});

module.exports = { registerUser, authUser, fetchDoctors };
