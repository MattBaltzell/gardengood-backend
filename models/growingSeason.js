"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");

class GrowingSeason {
  /**
   * Create plant_season entry
   */

  static async create(plantId, growingSeasonId) {
    const growingSeasonRes = await db.query(
      `
        INSERT INTO plants_seasons
          (plant_id, season_id)
          VALUES ($1,$2)
          returning plant_id AS "plantId"
        `,
      [plantId, growingSeasonId]
    );

    return growingSeasonRes.rows[0].id;
  }
}

module.exports = GrowingSeason;
