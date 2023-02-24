"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");

class Plant {
  /** Find all plants */
  static async findAll() {
    const plants = await db.query(
      `
    SELECT id,
        name, 
        species, 
        img_url AS "imgUrl",
        is_perrenial AS "isPerrenial",
        description,
        days_to_maturity_min AS "daysToMaturityMin",
        days_to_maturity_max AS "daysToMaturityMax"
    FROM plants`
    );
    return plants.rows;
  }

  /** Given a plant id, return data about a plant */

  static async get(id) {
    const plant = await db.query(
      `
    SELECT id,
        name, 
        species, 
        img_url AS "imgUrl",
        is_perrenial AS "isPerrenial",
        description,
        days_to_maturity_min AS "daysToMaturityMin",
        days_to_maturity_max AS "daysToMaturityMax"
    FROM plants
    WHERE id = $1`,
      [id]
    );

    if (!plant.rows[0]) throw new NotFoundError(`No plant: ${id}`);
    return plant.rows[0];
  }
}

module.exports = Plant;
