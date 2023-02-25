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
      GROUP BY p.id`
    );

    return plants.rows;
  }

  /** Given a plant id, return data about a plant */

  static async get(id) {
    const plant = await db.query(
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

    if (!plant.rows[0]) throw new NotFoundError(`No plant: ${id}`);
    return plant.rows[0];
  }
}

module.exports = Plant;
