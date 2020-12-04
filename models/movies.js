const mongoose = require("mongoose");
const Joi = require("joi");
const Schema = mongoose.Schema;
const { genreSchema } = require("./genres");

const movieSchema = Schema({
  title: {
    type: String,
    require: true,
    trim: true,
    minlength: 5,
    maxlength: 50,
  },
  genre: {
    type: genreSchema,
    require: true,
  },
  numberInStock: {
    type: Number,
    require: true,
    min: 0,
    max: 255,
  },
  dailyRentalRate: {
    type: Number,
    require: true,
    min: 0,
    max: 255,
  },
});

const Movie = mongoose.model("Movie", movieSchema);

function joiValidate(movie) {
  const schema = Joi.object({
    title: Joi.string().min(5).max(50).required(),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number().min(0).required(),
    dailyRentalRate: Joi.number().min(0).required(),
  });

  return schema.validate(movie);
}

exports.Movie = Movie;
exports.validate = joiValidate;
