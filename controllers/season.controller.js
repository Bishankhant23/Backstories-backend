import episodeModel from "../models/episode.model.js";
import seasonModel from "../models/season.model.js";
import { apiResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/globalAsyncErrorHandler.js";
import { createSeasonSchema } from "../validations/season.validation.js";

export const deleteSeason = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const seasonId = req.params.seasonId;

  const season = await seasonModel.findOne({ _id: seasonId, user: userId.toString() });
  if (!season) {
    return res.status(404).send(apiResponse.error("Season not found or does not belong to the user."));
  }

  await episodeModel.deleteMany({ season: seasonId });

  await seasonModel.deleteOne({ _id: seasonId });

  return res.status(200).send(apiResponse.success(null, "Season deleted successfully."));
});



export const addSeason = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const { error } = createSeasonSchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .send(apiResponse.validationError(error.details[0].message));
  }

  const { name, year, description } = req.body;

  const existingSeasons = await seasonModel.find({ user: userId });
  const seasonNumber = existingSeasons.length + 1;

  const newSeason = await seasonModel.create({
    user: userId,
    name,
    year,
    description,
    seasonNumber,
  });

  return res
    .status(201)
    .send(apiResponse.success(newSeason, 'Season created successfully.'));
});
