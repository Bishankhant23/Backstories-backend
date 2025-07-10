import Season from "../models/season.model.js";
import  Episode from "../models/episode.model.js"
import userModel from "../models/user.model.js";

import asyncHandler from "../utils/globalAsyncErrorHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { pagination } from "../utils/pagination.js";


export const getMySeasons = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const seasons = await Season.find({ user: userId }).sort({ year: -1 });

  res.status(200).send(apiResponse.success(seasons, "Seasons fetched successfully"));
});

export const getMyEpisodesBySeason = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const seasonId = req.params.seasonId;

  const season = await Season.findOne({ _id: seasonId, user: userId });
  if (!season) {
    return res.status(404).send(apiResponse.error("Season not found or does not belong to the user."));
  }

  const episodes = await Episode.find({ season: seasonId, user: userId })
    .select("user title content cast favoriteCharacters expectations learning mood type ")
    .sort({ date: 1 })
    .populate("cast", "username email")
    .populate("favoriteCharacters", "username email");

  return res.status(200).send(apiResponse.success(episodes, "Episodes fetched successfully."));
});

export const getOtherUserProfile = asyncHandler(async (req, res) => {
  const targetUserId = req.params.userId;

  const loggedInUserId = req.user?._id?.toString();

  const { page, limit, skip } = pagination(req.query.page, req.query.limit);

  const targetUser = await userModel
    .findById(targetUserId)
    .select('-password -createdAt -updatedAt');

  if (!targetUser) {
    return res.status(404).send(apiResponse.error('User not found'));
  }

  const isFollower = loggedInUserId
    ? targetUser.followers.includes(loggedInUserId)
    : false;

  const basicProfile = {
    _id: targetUser._id,
    username: targetUser.username,
    email: targetUser.email,
    isPrivate: targetUser.isPrivate,
    followers: targetUser.followers,
    following: targetUser.following,
    followRequests: targetUser.followRequests,
  };

  if (targetUser.isPrivate && !isFollower) {
    return res.status(200).send(
      apiResponse.success(
        {
          ...basicProfile,
          wasPrivate: true,
        },
        'User profile is private'
      )
    );
  }

  const totalSeasons = await Season.countDocuments({ user: targetUserId });
  const seasons = await Season.find({ user: targetUserId })
    .skip(skip)
    .limit(limit)
    .lean();

  const totalPages = Math.ceil(totalSeasons / limit);

  return res.status(200).send(
    apiResponse.success(
      {
        ...basicProfile,
        wasPrivate: false,
        seasons,
        seasonsPagination: {
          page,
          limit,
          totalSeasons,
          totalPages,
        },
      },
      'User profile fetched successfully'
    )
  );
});

export const searchUsers = asyncHandler(async (req, res) => {
  const query = req.query.query?.trim();

  if (!query) {
    return res.status(400).send(apiResponse.validationError("Query parameter is required."));
  }

  const regex = new RegExp(query, 'i'); // case-insensitive

  const users = await userModel.find({
    $or: [
      { username: { $regex: regex } },
      { email: { $regex: regex } }
    ]
  })
  .select('_id username email profilePic') // minimal safe fields
  .limit(10);

  res.status(200).send(apiResponse.success(users, "User search successful."));
});