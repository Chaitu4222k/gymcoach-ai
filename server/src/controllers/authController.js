const { validationResult } = require("express-validator");

const {
  registerUser,
  loginUser,
} = require("../services/authService");

const register = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  try {
    const user = await registerUser(req.body);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);

    if (error.message === "Email already exists") {
      return res.status(400).json({
        message: error.message,
      });
    }

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const login = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  try {
    const { user, token } = await loginUser(req.body);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);

    if (error.message === "Invalid email or password") {
      return res.status(401).json({
        message: error.message,
      });
    }

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  register,
  login,
};