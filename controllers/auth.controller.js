import bcrypt from "bcrypt";
import passport from "passport";
import userModel from "../models/user.model.js";
import { registerSchema, loginSchema } from "../validations/auth.validation.js";
import asyncHandler from "../utils/globalAsyncErrorHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import Season from "../models/season.model.js";
import { pagination } from "../utils/pagination.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    return res.status(400).send(apiResponse.validationError(error.details[0].message));
  }

  const { username, email, password, birthdate, generatePastSeasons } = req.body;

  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    return res.status(409).send(apiResponse.error("Email is already registered."));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await userModel.create({
    username,
    email,
    password: hashedPassword,
    birthdate,
  });

  if (generatePastSeasons) {
    const birthYear = new Date(birthdate).getFullYear();
    const currentYear = new Date().getFullYear();
    const totalSeasons = currentYear - birthYear + 1; // including current year

    const seasonsToCreate = [];
    for (let i = 0; i < totalSeasons; i++) {
      seasonsToCreate.push({
        user: newUser._id,
        seasonNumber: i + 1,
        year: birthYear + i,
        title: `Season ${i + 1}`,
      });
    }
    await Season.insertMany(seasonsToCreate);
  }

  req.login(newUser, (err) => {
    if (err) {
      console.error("Login after register error:", err);
      return res.status(500).send(apiResponse.error("Error logging in after registration."));
    }    

    return res.status(201).send(
      apiResponse.success(
        newUser,
        "Registration successful."
      )
    );
  });
});


export const loginUser = asyncHandler(async (req, res, next) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).send(apiResponse.validationError(error.details[0].message));
  }

  await new Promise((resolve, reject) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return reject(err);
      if (!user) return reject(new Error(info?.message || "Invalid credentials"));
      req.login(user, (err) => {
        if (err) return reject(err);
        resolve(user);
      });
    })(req, res, next);
  });

  return res.status(200).send(
    apiResponse.success(
      req.user,
      "Login successful"
    )
  );
});

export const logoutUser = asyncHandler(async (req, res) => {
  await new Promise((resolve, reject) => {
    req.logout((err) => {
      if (err) return reject(err);
      res.clearCookie("connect.sid"); // Clear cookie name accordingly
      resolve();
    });
  });

  return res.status(200).send(apiResponse.success({}, "Logged out successfully"));
});



export const getMyProfile = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if(!userId){
    return res.status(402).send(apiResponse.error('User not found'));
  }

  const { page, limit, skip } = pagination(req.query.page, 222);


  const user = await userModel
    .findById(userId)
    .select('-password -createdAt -updatedAt')
    .populate('followers', 'username email')
    .populate('following', 'username email')
    .populate('followRequests', 'username email');

  if (!user) {
    return res.status(404).send(apiResponse.error('User not found'));
  }

  const totalSeasons = await Season.countDocuments({ user: userId });

  const seasons = await Season.find({ user: userId })
    .skip(skip)
    .limit(limit)
    .lean();

  const totalPages = Math.ceil(totalSeasons / limit);

  const userWithSeasons = {
    ...user.toObject(),
    seasons,
    seasonsPagination: {
      page,
      limit,
      totalSeasons,
      totalPages,
    },
  };

  res.status(200).send(apiResponse.success(userWithSeasons, 'Profile fetched successfully'));
});
