"use strict";

const db = require("../db");
const { sqlForPartialUpdate } = require("../helpers/sql");
const { NotFoundError, BadRequestError } = require("../expressError");
// duplicate?

/** Related functions for beds. */

class Bed {
  // create

  static async create({ name, gardenId }) {
    const bedRes = await db.query(
      `INSERT INTO beds
            (name, garden_id AS "gardenId")
            VALUES ($1,$2)
            RETURNING id, name, garden_id
    `,
      [name, gardenId]
    );

    const bed = bedRes.rows[0];

    return { bed };
  }

  /** Given a bed id, return data about bed.
   *
   * Returns { id, plantId, bedId, qty, plantedAt }
   *
   * Throws NotFoundError if bed not found.
   **/
  static async get(id) {
    const bedRes = await db.query(
      `SELECT   g.id,
                g.name,
                g.description,
                json_agg(ug.username) AS "users"
            FROM users_beds AS ug
            JOIN beds AS g
            ON ug.bed_id = g.id
            WHERE id = $1
            GROUP BY g.id`,
      [id]
    );

    const bed = bedRes.rows[0];

    if (!bed) throw new NotFoundError(`No bed: ${id}`);

    return bed;
  }

  static async findAll(username) {
    const bedRes = await db.query(
      `SELECT   g.id,
                g.name,
                g.description,
                json_agg(ug.username) AS "users"
            FROM users_beds AS ug
            JOIN beds AS g
            ON ug.bed_id = g.id
            WHERE username = $1
            GROUP BY g.id`,
      [username]
    );

    const beds = bedRes.rows;

    return beds;
  }

  // addUser
  // removeUser

  // delete

  static async remove(id) {
    const bedRes = await db.query(
      `DELETE from beds
            WHERE id = $1
            RETURNING id, name`,
      [id]
    );

    const bed = bedRes.rows[0];

    if (!bed) throw new NotFoundError(`No bed: ${id}`);

    return bed;
  }
}

module.exports = Bed;
