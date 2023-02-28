"use strict";

const request = require("supertest");
const app = require("../app");
const db = require("../db");
const Plant = require("../models/plant");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  newPlantData,
  u1Token,
  adminToken,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /plants */

describe("POST /plants/", function () {
  test("works", async function () {
    const res = await request(app)
      .post(`/plants`)
      .send(newPlantData)
      .set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual({
      id: expect.any(Number),
    });
  });

  test("bad request when missing parameters", async function () {
    const data = {
      name: "POST Route Test Plant",
      daysToMaturityMin: 50,
      daysToMaturityMax: 100,
      sunlight: [1, 2],
      growingSeasons: [2, 8],
      instructions: [
        { typeId: 1, description: "plant them" },
        { typeId: 2, description: "prune them" },
      ],
    };
    const resp = await request(app)
      .post("/plants")
      .send(data)
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request when attempting to update invalid parameter", async function () {
    const resp = await request(app)
      .post("/plants")
      .send({ ...newPlantData, tastesYummy: true })
      .set("authorization", `Bearer ${adminToken}`);

    expect(resp.statusCode).toEqual(400);
  });

  test("unauth when not admin", async function () {
    const res = await request(app)
      .post(`/plants/`)
      .send(newPlantData)
      .set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(401);
  });

  test("unauth when anon", async function () {
    const res = await request(app).post(`/plants/`).send(newPlantData);
    expect(res.statusCode).toEqual(401);
  });
});

/************************************** GET /plants/:id */

describe("GET /plants/:id", function () {
  test("works", async function () {
    const plant1res = await db.query(
      `SELECT id FROM plants WHERE name = 'Routes Test Plant 1'`
    );
    const plant1Id = plant1res.rows[0].id;

    const res = await request(app)
      .get(`/plants/${plant1Id}`)
      .set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(200);
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

  test("works admin", async function () {
    const plant1res = await db.query(
      `SELECT id FROM plants WHERE name = 'Routes Test Plant 1'`
    );
    const plant1Id = plant1res.rows[0].id;

    const res = await request(app)
      .get(`/plants/${plant1Id}`)
      .set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
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

  test("unauth when anon", async function () {
    const plant1res = await db.query(
      `SELECT id FROM plants WHERE name = 'Routes Test Plant 1'`
    );
    const plant1Id = plant1res.rows[0].id;

    const res = await request(app).get(`/plants/${plant1Id}`);
    expect(res.statusCode).toEqual(401);
  });
});

/************************************** GET /plants/ */

describe("GET /plants/", function () {
  test("works", async function () {
    const res = await request(app)
      .get(`/plants/`)
      .set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(200);
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

  test("works admin", async function () {
    const res = await request(app)
      .get(`/plants/`)
      .set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
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

  test("unauth when anon", async function () {
    const res = await request(app).get(`/plants/`);
    expect(res.statusCode).toEqual(401);
  });
});

/************************************** DELETE /plants/:id */

describe("DELETE /plants/:id", function () {
  test("works", async function () {
    const plantRes = await db.query(
      `SELECT id FROM plants WHERE name='Routes Test Plant 2'`
    );
    console.log(plantRes);
    const id = plantRes.rows[0].id;
    const res = await request(app)
      .delete(`/plants/${id}`)
      .set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ deleted: id });
  });
});
