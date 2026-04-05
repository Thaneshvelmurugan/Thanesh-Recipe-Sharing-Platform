import { User } from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";

const buildAuthPayload = (user) => ({
  token: generateToken(user._id),
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    bio: user.bio,
    dietaryPreferences: user.dietaryPreferences,
    followersCount: user.followers.length,
    followingCount: user.following.length
  }
});

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "Email already in use" });
  }

  const user = await User.create({ name, email, password });
  res.status(201).json(buildAuthPayload(user));
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password))) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  res.json(buildAuthPayload(user));
};

export const getMe = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.json(user);
};
