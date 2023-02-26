"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");

class Plant {
  /** Find all plants
   *
   */

  static async findAll() {
    const plants = await db.query(
      `
      SELECT p.id,
          p.name,
          p.species,
          p.img_url AS "imgUrl",
          p.is_perrenial AS "isPerrenial",
          p.description,
          p.days_to_maturity_min AS "daysToMaturityMin",
          p.days_to_maturity_max AS "daysToMaturityMax",
          json_agg(DISTINCT sun.name) AS "sunlight",
          json_agg(DISTINCT sea.name) AS "growingSeasons"
      FROM plants AS p
      JOIN plants_sunlight AS psu
      ON p.id = psu.plant_id
      JOIN sunlight AS sun
      ON psu.sunlight_id = sun.id
      JOIN plants_seasons AS pse
      ON p.id = pse.plant_id
      JOIN seasons AS sea
      ON pse.season_id = sea.id
      GROUP BY p.id
      ORDER BY p.name`
    );

    return plants.rows;
  }

  /** Given a plant id, return data about a plant */

  static async get(id) {
    const plantRes = await db.query(
      `
      SELECT p.id,
          p.name,
          p.species,
          p.img_url AS "imgUrl",
          p.is_perrenial AS "isPerrenial",
          p.description,
          p.days_to_maturity_min AS "daysToMaturityMin",
          p.days_to_maturity_max AS "daysToMaturityMax",
          json_agg(DISTINCT sun.name) AS "sunlight",
          json_agg(DISTINCT sea.name) AS "growingSeasons"
      FROM plants AS p
      JOIN plants_sunlight AS psu
      ON p.id = psu.plant_id
      JOIN sunlight AS sun
      ON psu.sunlight_id = sun.id
      JOIN plants_seasons AS pse
      ON p.id = pse.plant_id
      JOIN seasons AS sea
      ON pse.season_id = sea.id
      WHERE p.id = $1
      GROUP BY p.id`,
      [id]
    );

    if (!plantRes.rows[0]) throw new NotFoundError(`No plant: ${id}`);

    const plant = plantRes.rows[0];

    const instructionsRes = await db.query(
      `
      SELECT it.name, 
        i.description
      FROM instructions AS i
      JOIN instruction_types As it
      ON i.type_id = it.id
      WHERE i.plant_id = $1`,
      [id]
    );

    const instructionsArr = instructionsRes.rows;

    const instructions = {};
    instructionsArr.forEach(
      (inst) => (instructions[inst.name] = inst.description)
    );

    plant.instructions = instructions;

    return plant;
  }
}

module.exports = Plant;
