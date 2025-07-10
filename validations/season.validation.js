import Joi from 'joi';

export const createSeasonSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'string.base': 'Name must be a string',
    'string.empty': 'Name is required',
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name can be at most 100 characters',
    'any.required': 'Name is required',
  }),

  year: Joi.number().integer().min(1900).max(new Date().getFullYear() + 1).required().messages({
    'number.base': 'Year must be a number',
    'number.min': 'Year cannot be before 1900',
    'number.max': `Year cannot be after ${new Date().getFullYear() + 1}`,
    'any.required': 'Year is required',
  }),

  description: Joi.string().allow('').max(500).messages({
    'string.max': 'Description can be at most 500 characters',
  }),
})