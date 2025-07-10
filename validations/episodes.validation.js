import Joi from "joi";

export const createEpisodeSchema = Joi.object({
  title: Joi.string().min(3).max(200).required(),
  content: Joi.string().min(1).required(),
  date: Joi.date().optional(),
  cast: Joi.array().items(Joi.string().hex().length(24)).optional(),
  photos: Joi.array().items(Joi.string().uri()).optional(),
  favoriteCharacters: Joi.array().items(Joi.string().hex().length(24)).optional(),
  type: Joi.string().valid("public", "private", "personal").optional(),
  season : Joi.string().required(),
  expectations:Joi.string().optional().allow(""),
  learning : Joi.string().optional().allow("")
});
