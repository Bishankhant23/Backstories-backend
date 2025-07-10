import Episode from "../models/episode.model.js";
import Season from "../models/season.model.js";
import asyncHandler from "../utils/globalAsyncErrorHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import {createEpisodeSchema} from "../validations/episodes.validation.js"

export const addEpisode = asyncHandler(async (req, res) => {
  const { error } = createEpisodeSchema.validate(req.body);
  if (error) {
    return res.status(400).send(apiResponse.validationError(error.details[0].message));
  }
  
  const userId = req.user._id;
  const seasonId = req.body?.season;
  const { title, content, date,learning="",expectations="", cast = [], favoriteCharacters = [], type = "personal" } = req.body;

  const castSet = new Set([...cast.map(String), userId.toString()]);
  const castFinal = Array.from(castSet);

  const season = await Season.findOne({ _id: seasonId, user: userId?.toString() });
  if (!season) {
    return res.status(404).send(apiResponse.error("Season not found or does not belong to the user."));
  }

  const photos = req.files?.map(file => file.path) || [];

  const episode = await Episode.create({
    user: userId,
    season: seasonId,
    title,
    content,
    date: date || Date.now(),
    cast: castFinal,
    photos,
    favoriteCharacters,
    type,
    learning,
    expectations
  });

  return res.status(201).send(apiResponse.success(episode, "Episode created successfully."));
});


export const getEpisodeById = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const id = req.params.id;

  const episodes = await Episode.findOne({ _id:id, user: userId })
    .select("user title content cast favoriteCharacters expectations learning mood type photos ")
    .sort({ date: 1 })
    .populate("cast", "username email")
    .populate("favoriteCharacters", "username email");

  return res.status(200).send(apiResponse.success(episodes, "Episodes fetched successfully."));
});

export const getEpisodesBySeason = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const seasonId = req.params.seasonId;

  const episodes = await Episode.find({ user: userId, season: seasonId })
    .select("_id title")
    .sort({ createdAt: -1 });

  return res.status(200).send(
    apiResponse.success(episodes, "Episodes fetched successfully by season.")
  );
});
