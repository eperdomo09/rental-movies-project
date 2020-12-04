const { use } = require("express/lib/router");
const mongoose = require("mongoose");
const request = require("supertest");
const { Genre } = require("../../models/genres");
const { User } = require("../../models/users");

let server;

describe("/api/genres", () => {
  beforeEach(() => {
    server = require("../../app");
  });
  afterEach(async () => {
    server.close();
    await Genre.remove({});
  });

  describe("GET /", () => {
    it("should return all Genre", async () => {
      await Genre.collection.insertMany([
        { name: "Genre1" },
        { name: "Genre2" },
      ]);
      const res = await request(server).get("/vidly.com/api/genres");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((g) => g.name === "Genre1")).toBeTruthy();
      expect(res.body.some((g) => g.name === "Genre2")).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    it("should return genre if valid Id is passed", async () => {
      const genre = new Genre({ name: "Genre1" });
      await genre.save();

      const res = await request(server).get(
        `/vidly.com/api/genres/${genre._id}`
      );
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", genre.name);
    });

    it("should return 404 if invalid Id is passed", async () => {
      const res = await request(server).get("/vidly.com/api/genres/1");
      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    let token;
    let name;

    const exec = async () => {
      return await request(server)
        .post("/vidly.com/api/genres")
        .set("x-auth-token", token)
        .send({ name });
    };

    beforeEach(() => {
      token = new User().generateAuthToken();
      name = "Genre1";
    });

    it("should return 401 if cliend is not logged in", async () => {
      token = "";
      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 400 if genre is less than 5 characters", async () => {
      name = "1234";
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if genre is more 50 characters", async () => {
      name = new Array(52).join("e");
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if genre is empty", async () => {
      name = "";
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if genre is not a string", async () => {
      name = 1;

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should save the genre if it is valid", async () => {
      await exec();

      const genre = await Genre.find({ name: "Genre1" });
      expect(genre).not.toBeNull();
    });

    it("should return the genre if it is valid", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "Genre1");
    });
  });

  describe("PUT /", () => {
    // beforeEah(() => {});

    // afterEach(() => {});

    it("should return 401 if user is not logged in", async () => {
      const token = "";
      const genre = new Genre({ name: "Genre1" });
      await genre.save();

      const res = await request(server)
        .put(`/vidly.com/api/genres/ ${genre._id}`)
        .set("x-auth-token", token)
        .send({ name: "" });

      expect(res.status).toBe(401);
    });

    it("should return 404 if an invalid Id was given", async () => {
      const token = new User().generateAuthToken();

      const res = await request(server)
        .put(`/vidly.com/api/genres/1`)
        .set("x-auth-token", token)
        .send({ name: "Genre1" });

      expect(res.status).toBe(404);
    });

    it("should return 404 if genre with given ID was not found", async () => {
      const token = new User().generateAuthToken();

      const res = await request(server)
        .put(`/vidly.com/api/genres/${mongoose.Types.ObjectId().toHexString()}`)
        .set("x-auth-token", token)
        .send({ name: "Genre1" });

      expect(res.status).toBe(404);
    });

    it("should return 400 if new genre is less than 5 character", async () => {
      const newName = "1234";
      const genre = new Genre({ name: "Genre1" });
      await genre.save();

      const token = new User().generateAuthToken();

      const res = await request(server)
        .put(`/vidly.com/api/genres/${genre._id}`)
        .set("x-auth-token", token)
        .send({ name: newName });

      expect(res.status).toBe(400);
    });

    it("should return 200 if new genre is valid", async () => {
      const genre = new Genre({ name: "Genre1" });
      await genre.save();

      const newName = "Genre2";
      const token = new User().generateAuthToken();

      const res = await request(server)
        .put(`/vidly.com/api/genres/${genre._id}`)
        .set("x-auth-token", token)
        .send({ name: newName });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "Genre2");
    });
  });

  describe("DELETE /", () => {
    it("should return 401 if user is not logged in", async () => {
      const token = "";
      const genre = new Genre({ name: "Genre1" });
      await genre.save();

      const res = await request(server)
        .delete(`/vidly.com/api/genres/ ${genre._id}`)
        .set("x-auth-token", token);

      expect(res.status).toBe(401);
    });

    it("should return 403 if user has access denied", async () => {
      const token = new User().generateAuthToken();
      const genre = new Genre({ name: "Genre1" });
      await genre.save();

      const res = await request(server)
        .delete(`/vidly.com/api/genres/ ${genre._id}`)
        .set("x-auth-token", token);

      expect(res.status).toBe(403);
    });

    it("should return 404 if genre is an invalid ID", async () => {
      const user = {
        _id: mongoose.Types.ObjectId().toHexString(),
        isAdmin: true,
      };
      const token = new User(user).generateAuthToken();

      const res = await request(server)
        .delete(`/vidly.com/api/genres/1`)
        .set("x-auth-token", token);

      expect(res.status).toBe(404);
    });

    it("should return 404 if genre with given ID was not found", async () => {
      const user = {
        _id: mongoose.Types.ObjectId().toHexString(),
        isAdmin: true,
      };
      const token = new User(user).generateAuthToken();

      const res = await request(server)
        .delete(
          `/vidly.com/api/genres/${mongoose.Types.ObjectId().toHexString()}`
        )
        .set("x-auth-token", token);

      expect(res.status).toBe(404);
    });

    it("should return 200 if genre is delele success", async () => {
      const user = {
        _id: mongoose.Types.ObjectId().toHexString(),
        isAdmin: true,
      };
      const genre = new Genre({ name: "Genre1" });
      await genre.save();

      const token = new User(user).generateAuthToken();

      const res = await request(server)
        .delete(`/vidly.com/api/genres/${genre._id}`)
        .set("x-auth-token", token);

      expect(res.status).toBe(200);
    });
  });
});
