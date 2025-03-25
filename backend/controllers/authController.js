const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Generate JWT Token
const generateToken = (id, type) => {
  return jwt.sign({ id, type }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

exports.register = async (req, res) => {
  const { name, type, phNo, email, ngoName, location, password } = req.body;

  try {
    // Trim the fields to remove any leading or trailing spaces
    const trimmedPhNo = phNo?.trim() || "";
    const trimmedEmail = email?.trim() || "";

    // Ensure at least one of phNo or email is provided and neither is an empty string
    if (trimmedPhNo === "" && trimmedEmail === "") {
      return res
        .status(400)
        .json({ message: "Either Phone Number or Email is required" });
    }

    // Check if the user already exists by email
    const existingUserByEmail = trimmedEmail
      ? await User.findOne({ email: trimmedEmail })
      : null;
    if (existingUserByEmail) {
      return res
        .status(400)
        .json({ message: "User already registered with this email" });
    }

    // Check if the user already exists by phone number (if provided)
    const existingUserByPhone = trimmedPhNo
      ? await User.findOne({ phNo: trimmedPhNo })
      : null;
    if (existingUserByPhone) {
      return res
        .status(400)
        .json({ message: "User already registered with this phone number" });
    }

    // Create new user
    const user = new User({
      name,
      type,
      phNo: trimmedPhNo || null, // Ensure phNo is null if empty
      email: trimmedEmail || null,
      ngoName,
      location,
      password,
    });

    await user.save();

    const token = generateToken(user._id, user.type);
    res.status(201).json({ token, message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login a User
exports.login = async (req, res) => {
  const { email, password, phNo, type } = req.body;

  try {
    let user;

    // Check if we are using email or phNo number for login
    if (email) {
      user = await User.findOne({ email });
    } else if (phNo) {
      // If no email, look up by phNo
      user = await User.findOne({ phNo });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.type !== type) {
      return res.status(403).json({ message: "Invalid user type" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = generateToken(user._id, user.type);

    // Prepare the response data based on user type
    let userDetails = {
      id: user._id,
      name: user.name,
      type: user.type,
      phNo: user.phNo,
      email: user.email,
    };

    // If the user is an NGO, add the NGO details to the response
    if (user.type === "ngo") {
      userDetails.ngoName = user.ngoName;
      userDetails.location = user.location; // Location could be a GeoJSON object
    }

    if (user.type === "admin") {
      userDetails.admin = true;
    }

    // Respond with token and user details
    res.status(200).json({
      token,
      message: "Login successful",
      userDetails,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
