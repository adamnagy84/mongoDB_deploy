import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  getAccessCookieOptions,
  getRefreshCookieOptions,
  signAccessToken,
  signRefreshToken,
} from "../utils/jwt.js";
import jwt from "jsonwebtoken";

export const registerUser = asyncHandler(async (req, res) => {
  const { username, password, email } = req.body;

  if (!username?.trim() || !password?.trim() || !email?.trim()) {
    return res.status(400).json({ message: "All field are required" });
  }

  const existing = await User.findOne({
    $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }], //ha valamelyike igaz, azt megtalálja, bármelyik fele igaz az array-nek
  });

  if (existing) {
    return res
      .status(409)
      .json({ message: "Username or email is duplicated." });
  }

  const user = await User.create({
    username,
    email: email.toLowerCase(),
    password,
  });

  res.status(201).json({
    message: "User created successfully.",
    user: {
      id: user._id,
      email: user.email,
      username: user.username,
    },
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email?.trim() || !password?.trim()) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const existing = await User.findOne({
    email: email.toLowerCase(),
  }).select("+password +refreshToken");

  if (!existing) {
    return res.status(404).json({ message: "User not found." });
  }

  const isMatch = await existing.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials." });
  }

  //TOKEN
  const accessToken = signAccessToken({
    id: existing._id,
    email: existing.email,
    username: existing.username,
  });

  const refreshToken = signRefreshToken({
    id: existing._id,
    email: existing.email,
    username: existing.username,
  });

  // refreshToken mentése DB-be
  existing.refreshToken = (existing.refreshToken || []).concat(refreshToken);
  await existing.save();

  //COOKIES
  res.cookie("accessToken", accessToken, getAccessCookieOptions());
  res.cookie("refreshToken", refreshToken, getRefreshCookieOptions());

  res.status(200).json({
    message: "Successfull login",
    user: {
      id: existing._id,
      email: existing.email,
      username: existing.username,
    },
  });
});

// token és cookie nélküli verzió
// DEMO
export const logoutUser = asyncHandler(async (req, res) => {
  /*   const { email } = req.body;

  if (!email?.trim()) {
    return res.status(400).json({ message: "Email is required" });
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  } */

  const isProd = process.env.NODE_ENV === "production";
  const refreshToken = req.cookies?.refreshToken;

  //DB-ből töröljük a refreshToken-t (ha van)
  if (refreshToken) {
    const user = await User.findOne({ refreshToken: refreshToken }).select(
      "+refreshToken",
    );

    if (user) {
      user.refreshToken = user.refreshToken.filter((t) => t !== refreshToken);
      await user.save();
    }
  }

  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/api/v1/users",
  });

  res.status(200).json({ message: "Logged out successfully." });
});

export const getMe = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "Missing refresh token" });
  }

  // 1. Megkeressük a felhasználót, akinél ott van ez a token
  const user = await User.findOne({ refreshToken: refreshToken }).select(
    "+refreshToken",
  );

  // REUSE DETECTION (Ha a token nincs a DB-ben, de formailag valid lehet)
  if (!user) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      // Ha valid a token, de nincs a DB-ben -> valaki már felhasználta! Büntetés: minden session törlése.
      await User.updateOne({ _id: decoded.id }, { $set: { refreshToken: [] } });
      return res.status(403).json({ message: "Refresh token reuse detected" });
    } catch (error) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }
  }

  // 2. TOKEN VERIFY (Most már tudjuk, hogy a usernél ott van a token a DB-ben)
  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    // Ha lejárt vagy hibás, töröljük ezt az egy konkrét tokent a DB-ből
    user.refreshToken = user.refreshToken.filter((t) => t !== refreshToken);
    await user.save();
    return res
      .status(403)
      .json({ message: "Refresh token expired or invalid" });
  }

  // 3. BIZTONSÁGI CHECK
  if (String(user._id) !== String(decoded.id)) {
    return res.status(403).json({ message: "Token user mismatch" });
  }

  // 4. SIKERES ÁG - ROTÁCIÓ (Ez már a try-catch-en KÍVÜL van)
  const newAccessToken = signAccessToken({
    id: user._id,
    email: user.email,
    username: user.username,
  });

  const newRefreshToken = signRefreshToken({
    id: user._id,
    email: user.email,
    username: user.username,
  });

  // Régi token kiszedése, új berakása
  user.refreshToken = user.refreshToken
    .filter((t) => t !== refreshToken)
    .concat(newRefreshToken);

  await user.save();

  res.cookie("accessToken", newAccessToken, getAccessCookieOptions());
  res.cookie("refreshToken", newRefreshToken, getRefreshCookieOptions());

  return res.status(200).json({ message: "Token refreshed" });
});
