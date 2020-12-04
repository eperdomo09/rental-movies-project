const { Movie, validate } = require("../models/movies");
const { Genre } = require("../models/genres");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

//GET getting all genres
router.get("/", async (req, res) => {
  const movie = await Movie.find().sort("name");
  res.send(movie);
});

//GET getting an especific genre
router.get("/:id", async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  res.send(movie);
});

//POST inserting new genres
router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send("Invalid Genre");

    const movie = new Movie({
      title: req.body.title,
      genre: {
        _id: genre.id,
        name: genre.name,
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
    });
    await movie.save();
    res.send(movie);
  } catch (error) {
    console.log(error);
  }
});

//PUT updating genres
router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid Genre");

  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          title: req.body.title,
          genre: {
            _id: genre.id,
            name: genre.name,
          },
          numberInStock: req.body.numberInStock,
          dailyRentalRate: req.body.dailyRentalRate,
        },
      },
      { new: true }
    );

    if (!movie)
      return res.status(404).send("the movie with the given id was not found");

    res.send(movie);
  } catch (error) {
    console.log(error);
  }
});

//DELETE removing a single genre
router.delete("/:id", async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie)
      res.status(404).send("Customer with the given id was not found");

    res.send(movie);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
