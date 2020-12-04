const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");

const genreSchema = new Schema({
  name: {
    type: String,
    require: true,
    minlength: 5,
    maxlength: 50,
  },
});

const Genre = mongoose.model("Genre", genreSchema);

function validationGenres(genres) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
  });
  return schema.validate(genres);
}

exports.Genre = Genre;
exports.genreSchema = genreSchema;
exports.validate = validationGenres;
