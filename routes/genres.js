const validateObjectId = require("../middleware/validateObjectId");
const { Genre, validate } = require("../models/genres");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const express = require("express");
const router = express.Router();

//GET getting all genres
router.get("/", async (req, res) => {
  const genres = await Genre.find().sort("name");
  res.send(genres);
});

//GET getting an especific genre
router.get("/:id", validateObjectId, async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre) return res.status(404).send("Genre id was not found");
  res.send(genre);
});

//POST inserting new genres
router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = new Genre({ name: req.body.name });
  await genre.save();
  res.send(genre);
});

//PUT updating genres
router.put("/:id", [auth, validateObjectId], async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre) return res.status(404).send("Genre id was not found");

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  genre.name = req.body.name;
  try {
    await genre.save();
    res.send(genre);
  } catch (ex) {
    console.log(ex.message);
  }
});

//DELETE removing a single genre
router.delete("/:id", [auth, admin, validateObjectId], async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre) return res.status(404).send("Genre id was not found");

  await Genre.deleteOne({ _id: req.params.id });
  res.send(genre);
});

module.exports = router;
