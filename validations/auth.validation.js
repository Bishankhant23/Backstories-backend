import Joi from "joi";

export const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required().messages({
    "string.empty": "Username is required",
    "string.min": "Username must be at least 3 characters",
    "any.required": "Username is required"
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email",
    "string.empty": "Email is required",
    "any.required": "Email is required"
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
    "string.empty": "Password is required",
    "any.required": "Password is required"
  }),
  birthdate: Joi.date().required(),
  generatePastSeasons: Joi.boolean().optional()
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email",
    "string.empty": "Email is required",
    "any.required": "Email is required"
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
    "any.required": "Password is required"
  })
});
