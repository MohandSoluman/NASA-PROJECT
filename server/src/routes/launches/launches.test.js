const request = require("supertest");
const app = require("../../app");
describe("TEST GET /launches", () => {
  it("should response with 200 success", async () => {
    const response = await request(app)
      .get("/launches")
      .expect("Content-Type", /json/)
      .expect(200);
    expect(response.body).toBeInstanceOf(Array);
  });
});

describe("TEST PODT /launches", () => {
  it("should response with 201 sucess", async () => {
    const response = await request(app)
      .post("/launches")
      .send({
        launchDate: "2022-01-01",
        mission: "Test Mission",
        rocket: "Test Rocket",
        target: "Test Planet",
      })
      .expect("Content-Type", /json/)
      .expect(201);

    expect(response.body).toMatchObject({
      launchDate: "2022-01-01",
      mission: "Test Mission",
      rocket: "Test Rocket",
      target: "Test Planet",
    });
  });
});
