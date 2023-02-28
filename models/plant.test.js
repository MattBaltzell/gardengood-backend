"use strict";

const { NotFoundError } = require("../expressError");
const db = require("../db.js");
const Plant = require("./plant.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  newPlantData,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create(data) */
describe("create", function () {
  test("works", async function () {
    const plant = await Plant.create(newPlantData);
    expect(plant).toEqual({
      id: expect.any(Number),
    });
  });
});

/************************************** findAll() */

describe("findAll", function () {
  test("works", async function () {
    const plants = await Plant.findAll();
    expect(plants).toEqual([
      {
        id: expect.any(Number),
        name: "Test Plant 1",
        species: "Species 1",
        imgUrl: "https://plant1.jpg",
        isPerrenial: false,
        description: "Test description 1",
        daysToMaturityMin: 50,
        daysToMaturityMax: 75,
        sunlight: ["Full Sun"],
        growingSeasons: ["Spring"],
      },
      {
        id: expect.any(Number),
        name: "Test Plant 2",
        species: "Species 2",
        imgUrl: "https://plant2.jpg",
        isPerrenial: false,
        description: "Test description 2",
        daysToMaturityMin: 90,
        daysToMaturityMax: 120,
        sunlight: ["Full Sun", "Partial Sun"],
        growingSeasons: ["Fall", "Spring"],
      },
      {
        id: expect.any(Number),
        name: "Test Plant 3",
        species: "Species 3",
        imgUrl: "https://plant3.jpg",
        isPerrenial: true,
        description: "Test description 3",
        daysToMaturityMin: 365,
        daysToMaturityMax: 730,
        sunlight: ["Partial Shade", "Shade"],
        growingSeasons: ["Summer", "Winter"],
      },
    ]);
  });
});

/************************************** get() */

describe("get", function () {
  test("works", async function () {
    const plant1Res = await db.query(
      `SELECT id FROM plants WHERE name = 'Test Plant 1'`
    );
    const id = plant1Res.rows[0].id;
    const plant = await Plant.get(id);
    expect(plant).toEqual({
      id: expect.any(Number),
      name: "Test Plant 1",
      species: "Species 1",
      imgUrl: "https://plant1.jpg",
      isPerrenial: false,
      description: "Test description 1",
      daysToMaturityMin: 50,
      daysToMaturityMax: 75,
      sunlight: ["Full Sun"],
      growingSeasons: ["Spring"],
      instructions: {
        planting: 'Plant crops 6" apart.',
        pruning: "Prune at 6 weeks.",
        watering: "Water daily. Keep soil damp.",
      },
    });
  });

  test("notfounderror if plant with given id is not found", async function () {
    try {
      await Plant.get(99);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    const plantRes = await db.query(
      `SELECT id FROM plants WHERE name='Test Plant 1'`
    );
    const plantID = plantRes.rows[0].id;
    await Plant.remove(plantID);
    const res = await db.query(`SELECT * FROM plants WHERE id=$1`, [plantID]);
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such plant", async function () {
    try {
      await Plant.remove(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
