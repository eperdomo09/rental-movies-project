const request = require("supertest");
const { Genre } = require("../../models/genres");
const { User } = require("../../models/users");

let server;

describe("auth middleware", () => {
  beforeEach(() => {
    server = require("../../app");
  });
  afterEach(async () => {
    server.close();
    await Genre.remove({});
  });

  let token;

  const exec = () => {
    return request(server)
      .post("/vidly.com/api/genres")
      .set("x-auth-token", token)
      .send({ name: "Genre1" });
  };

  beforeEach(() => {
    token = new User().generateAuthToken();
  });

  it("should return a 401 if no token is provided", async () => {
    token = "";
    const res = await exec();

    expect(res.status).toBe(401);
  });

  it("should return a 400 if it is an invalid token", async () => {
    token = "a";
    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return a 200 if it is a valid token", async () => {
    const res = await exec();

    expect(res.status).toBe(200);
  });
});
