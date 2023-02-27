"use strict";

const request = require("supertest");
const app = require("../app");
const db = require("../db");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** GET /plants/:id */

describe("GET /plants/:id", function () {
  test("works", async function () {
    const plant1res = await db.query(
      `SELECT id FROM plants WHERE name = 'Routes Test Plant 1'`
    );
    const plant1Id = plant1res.rows[0].id;

    const res = await request(app).get(`/plants/${plant1Id}`);
    expect(res.body).toEqual({
      plant: {
        id: expect.any(Number),
        name: "Routes Test Plant 1",
        species: "Test Plant 1 Species",
        imgUrl: "Test Plant 1 URL",
        isPerrenial: false,
        description: "Test Plant 1 Description",
        daysToMaturityMin: 50,
        daysToMaturityMax: 100,
        sunlight: ["Full Sun", "Partial Sun"],
        growingSeasons: ["Fall", "Spring"],
        instructions: {
          planting: "plant them",
          pruning: "prune them",
          watering: "",
        },
      },
    });
  });
});

/************************************** GET /plants/ */

describe("GET /plants/", function () {
  test("works", async function () {
    const res = await request(app).get(`/plants/`);
    expect(res.body).toEqual({
      plants: [
        {
          id: expect.any(Number),
          name: "Routes Test Plant 1",
          species: "Test Plant 1 Species",
          imgUrl: "Test Plant 1 URL",
          isPerrenial: false,
          description: "Test Plant 1 Description",
          daysToMaturityMin: 50,
          daysToMaturityMax: 100,
          sunlight: ["Full Sun", "Partial Sun"],
          growingSeasons: ["Fall", "Spring"],
        },
        {
          id: expect.any(Number),
          name: "Routes Test Plant 2",
          species: "Test Plant 2 Species",
          imgUrl: "Test Plant 2 URL",
          isPerrenial: true,
          description: "Test Plant 2 Description",
          daysToMaturityMin: 75,
          daysToMaturityMax: 125,
          sunlight: ["Partial Shade", "Partial Sun"],
          growingSeasons: ["Summer", "Winter"],
        },
      ],
    });
  });
});
