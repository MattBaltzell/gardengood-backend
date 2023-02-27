"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");

class Sunlight {
  /**
   * Create plant_sunlight entry
   */

  static async create(plantId, sunlightId) {
    const sunlightRes = await db.query(
      `
        INSERT INTO plants_sunlight
          (plant_id, sunlight_id)
          VALUES ($1,$2)
          returning plant_id AS "plantId"
        `,
      [plantId, sunlightId]
    );

    return sunlightRes.rows[0].id;
  }
}

module.exports = Sunlight;
