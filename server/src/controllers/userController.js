import { Recipe } from "../models/Recipe.js";
import { User } from "../models/User.js";

export const updateProfile = async (req, res) => {
  const { name, bio, avatar, dietaryPreferences } = req.body;

  const user = await User.findById(req.user._id);
  user.name = name ?? user.name;
  user.bio = bio ?? user.bio;
  user.avatar = avatar ?? user.avatar;
  user.dietaryPreferences = dietaryPreferences ?? user.dietaryPreferences;

  await user.save();

  res.json(await User.findById(user._id).select("-password"));
};

export const getProfile = async (req, res) => {
  const user = await User.findById(req.params.id).select("-password").lean();
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const recipes = await Recipe.find({ author: user._id })
    .sort({ createdAt: -1 })
    .select("title photoUrl cuisine mealType ratings likes createdAt");

  res.json({
    ...user,
    recipes,
    followersCount: user.followers.length,
    followingCount: user.following.length
  });
};

export const getDashboard = async (req, res) => {
  const user = await User.findById(req.user._id)
    .select("-password")
    .populate("favorites", "title photoUrl cuisine mealType ratings createdAt")
    .lean();

  const myRecipes = await Recipe.find({ author: req.user._id })
    .sort({ createdAt: -1 })
    .select("title photoUrl cuisine mealType ratings likes createdAt");

  res.json({
    user,
    myRecipes,
    favorites: user.favorites
  });
};

export const toggleFollow = async (req, res) => {
  if (req.user._id.toString() === req.params.id) {
    return res.status(400).json({ message: "You cannot follow yourself" });
  }

  const currentUser = await User.findById(req.user._id);
  const targetUser = await User.findById(req.params.id);

  if (!targetUser) {
    return res.status(404).json({ message: "User not found" });
  }

  const isFollowing = currentUser.following.some((id) => id.toString() === targetUser._id.toString());

  if (isFollowing) {
    currentUser.following = currentUser.following.filter((id) => id.toString() !== targetUser._id.toString());
    targetUser.followers = targetUser.followers.filter((id) => id.toString() !== currentUser._id.toString());
  } else {
    currentUser.following.push(targetUser._id);
    targetUser.followers.push(currentUser._id);
  }

  await currentUser.save();
  await targetUser.save();

  res.json({
    following: !isFollowing,
    followersCount: targetUser.followers.length
  });
};
