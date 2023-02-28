"use strict";

const db = require("../db.js");
const User = require("../models/user");
const Plant = require("../models/plant");
const { createToken } = require("../helpers/tokens");

async function commonBeforeAll() {
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM instructions");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM plants_sunlight");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM plants_seasons");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM plants");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM users");

  await User.register({
    username: "u1",
    firstName: "U1F",
    lastName: "U1L",
    email: "user1@user.com",
    password: "password1",
    zipCode: "36830",
    isAdmin: false,
  });

  await User.register({
    username: "u2",
    firstName: "U2F",
    lastName: "U2L",
    email: "user2@user.com",
    password: "password2",
    zipCode: "36830",
    isAdmin: false,
  });

  await User.register({
    username: "u3",
    firstName: "U3F",
    lastName: "U3L",
    email: "user3@user.com",
    password: "password3",
    zipCode: "36830",
    isAdmin: false,
  });

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

const u1Token = createToken({ username: "u1", isAdmin: false });
const u2Token = createToken({ username: "u2", isAdmin: false });
const adminToken = createToken({ username: "admin", isAdmin: true });

const newPlantData = {
  name: "POST Route Test Plant",
  species: "Test Plant Species",
  imgUrl: "Test Plant URL",
  isPerrenial: false,
  description: "Test Plant Description",
  daysToMaturityMin: 50,
  daysToMaturityMax: 100,
  sunlight: [1, 2],
  growingSeasons: [2, 8],
  instructions: [
    { typeId: 1, description: "plant them" },
    { typeId: 2, description: "prune them" },
  ],
};

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  newPlantData,
  u1Token,
  u2Token,
  adminToken,
};
