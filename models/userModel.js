const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userModel = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, unique: true },
    password: { type: String, required: true },
    isPatient: { type: Boolean, required: true },
    specialization: { type: String },
    about: { type: String },
    pic: {
      type: String,
      required: true,
      default:
        "https://isobarscience.com/wp-content/uploads/2020/09/default-profile-picture1.jpg",
    },
  },
  { timestaps: true }
);

// a method to compare entered password to the saved password
userModel.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// a middleware to encrypt entered password
userModel.pre("save", async function (next) {
  if (!this.isModified) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userModel);
module.exports = User;
