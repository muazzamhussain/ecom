const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const signup = async (req, res) => {
  try {
    const { name, email, password, role, addresses } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(8);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      addresses,
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._index,
        name: newUser.name,
        email: newUser.email,
        addresses: newUser.addresses,
      },
    });
  } catch (error) {
    console.log("Signup Error: " + error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user);

    res.status(200).json({
      message: "sign-in successfull",
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    console.log("Login Error " + error);
    res.status(500).json({ mesage: "Internal server error" });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      return res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        addresses: user.addresses,
      });
    } else {
      res.status(404).json({ message: "User not found!" });
    }
  } catch (error) {
    console.log("Get user profile error " + error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      const { name, email } = req.body || user;
      if (req.body.password) {
        const salt = await bcrypt.genSalt(8);
        user.password = await bcrypt.hash(req.body.password, salt);
      }

      if (req.body.addresses) user.addresses = req.body.addresses;

      const updatedUser = await user.save();
      res.status(200).json(
        { message: "User profile updated" },
        {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          token: generateToken(updatedUser),
        },
      );
    } else {
      return res.status(404).json({ message: "User not found!" });
    }
  } catch (error) {
    console.log("Update profile error " + error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({ users });
  } catch (error) {
    console.log("Getting users error " + error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id || req.body.id;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      res.status(404).json({ message: "User not found!" });
    }

    res.status(200).json({ message: "user deleted successfully" });
  } catch (error) {
    console.log("Error deleting user " + error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  signup,
  signin,
  getUserProfile,
  updateProfile,
  getUsers,
  deleteUser,
};
