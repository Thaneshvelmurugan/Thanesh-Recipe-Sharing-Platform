import jwt from "jsonwebtoken";
import { config } from "../config.js";

export const generateToken = (userId) =>
  jwt.sign({ id: userId }, config.jwtSecret, { expiresIn: "7d" });
