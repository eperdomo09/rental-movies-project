const Joi = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const rentalSchema = new Schema({
  customer: {
    type: new Schema({
      name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 20,
      },
      phone: {
        type: String,
        required: true,
        minlength: 7,
        maxlength: 10,
      },
    }),
    require: true,
  },
  movie: {
    type: new Schema({
      title: {
        type: String,
        require: true,
        trim: true,
        minlength: 5,
        maxlength: 50,
      },
      dailyRentalRate: {
        type: Number,
        require: true,
        min: 0,
        max: 255,
      },
    }),
    required: true,
  },
  dateOut: {
    type: Date,
    required: true,
    default: Date.now,
  },
  dateReturned: {
    type: Date,
  },
  rentalfee: {
    type: Number,
    min: 0,
  },
});

const Rental = mongoose.model("Rental", rentalSchema);

function joiValidate(rental) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),

    movieId: Joi.objectId().required(),
  });

  return schema.validate(rental);
}

exports.validate = joiValidate;
exports.Rental = Rental;
