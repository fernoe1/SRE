import User from "../models/User.js";
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { transporter } from "../server.js";

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' });
}

const sendMail = async (req, res) => {
  try {
    const _id = req.user.id;

    const user = await User.findOne({ _id });
    if (!user) return res.status(404).json({ error: "User not found" });

    const token = createToken(user._id);

    const verifyLink =`http://localhost:3000/verification?token=${token}`;

    const mailOptions = {
      to: user.email,
      subject: "Jact email verification",
      html: `
        <a href="${verifyLink}" target="_blank">Verify email</a>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Verification email sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send email" });
  }
};

const verifyUser = async (req, res) => {
  const token = req.query.token;

  if (!token) return res.status(400).send("Invalid verification link");

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    const user = await User.findById(decoded._id);

    if (!user) return res.set(404).json({ error: "User not found" });

    user.isVerified = true;

    await user.save();

    res.json({ message: "Verified successfully" });
  } catch (err) {
    res.set(400).json({ error: err.message });
  }
}

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);

    const token = createToken(user._id);

    res.status(200).json({ email, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

const signupUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await User.signup(name, email, password);

    const token = createToken(user._id);

    res.status(201).json({ email, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Protected, only admin or owner can fetch
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const requesterId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const requester = await User.findById(requesterId);

    if (!requester) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const isOwner = requesterId === id;
    const isAdmin = requester.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: "Access denied" });
    }

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // ID from authenticated user
    const { address, city, state, postalCode, phoneNumber } = req.body;

    const updatedUser = await User.updateProfile(userId, {
      address,
      city,
      state,
      postalCode,
      phoneNumber,
    });

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export { loginUser, signupUser, getUserById, updateUserProfile, verifyUser, sendMail }