"use strict";

const db = require("../db.js");
const Plant = require("../models/plant");

async function commonBeforeAll() {
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM instructions");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM plants_sunlight");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM plants_seasons");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM plants");

  await Plant.create({
    name: "Routes Test Plant 1",
    species: "Test Plant 1 Species",
    imgUrl: "Test Plant 1 URL",
    isPerrenial: false,
    description: "Test Plant 1 Description",
    daysToMaturityMin: 50,
    daysToMaturityMax: 100,
    sunlight: [1, 2],
    growingSeasons: [2, 8],
    instructions: [
      { typeId: 1, description: "plant them" },
      { typeId: 2, description: "prune them" },
    ],
  });

  await Plant.create({
    name: "Routes Test Plant 2",
    species: "Test Plant 2 Species",
    imgUrl: "Test Plant 2 URL",
    isPerrenial: true,
    description: "Test Plant 2 Description",
    daysToMaturityMin: 75,
    daysToMaturityMax: 125,
    sunlight: [2, 3],
    growingSeasons: [5, 11],
    instructions: [
      { typeId: 1, description: "plant them deep" },
      { typeId: 2, description: "prune them way back" },
      { typeId: 3, description: "water heavily" },
    ],
  });
}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
};
