const jwt = require("jsonwebtoken");

const generateToken = (user, rememberMe = false) => {
  return jwt.sign(
    {
      id: user._id,
      _id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: rememberMe ? "30d" : "7d",
    },
  );
};

module.exports = generateToken;
