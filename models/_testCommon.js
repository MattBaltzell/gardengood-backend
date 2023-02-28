const bcrypt = require("bcrypt");

const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");

async function commonBeforeAll() {
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM instructions");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM instructions");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM plants_sunlight");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM plants");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM users");

  await db.query(
    `
        INSERT INTO users(username,
                          password,
                          first_name,
                          last_name,
                          email,
                          zip_code,
                          join_at)
        VALUES ('u1', $1, 'U1F', 'U1L', 'u1@email.com','36830', CURRENT_TIMESTAMP),
               ('u2', $2, 'U2F', 'U2L', 'u2@email.com','36830', CURRENT_TIMESTAMP)
        RETURNING username`,
    [
      await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
      await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
    ]
  );

  const plant1Res = await db.query(
    `
    INSERT INTO plants (name, 
        species, 
        img_url, 
        is_perrenial, 
        description, 
        days_to_maturity_min, days_to_maturity_max)
    VALUES
        ('Test Plant 1', 'Species 1', 'https://plant1.jpg', false, 'Test description 1', 50, 75)
    RETURNING id`
  );

  const plant2Res = await db.query(
    `
    INSERT INTO plants (name, 
        species, 
        img_url, 
        is_perrenial, 
        description, 
        days_to_maturity_min, days_to_maturity_max)
    VALUES
        ('Test Plant 2', 'Species 2', 'https://plant2.jpg', false, 'Test description 2', 90, 120)
    RETURNING id`
  );

  const plant3Res = await db.query(
    `
    INSERT INTO plants (name, 
        species, 
        img_url, 
        is_perrenial, 
        description, 
        days_to_maturity_min, days_to_maturity_max)
    VALUES
        ('Test Plant 3', 'Species 3', 'https://plant3.jpg', true, 'Test description 3', 365, 730)
    RETURNING id`
  );

  const plant1 = plant1Res.rows[0];
  const plant2 = plant2Res.rows[0];
  const plant3 = plant3Res.rows[0];

  await db.query(
    `
    INSERT into plants_seasons(
        plant_id,
        season_id
      )
    VALUES 
        ($1,2),
        ($2,2),
        ($2,8),
        ($3,5),
        ($3,11)
    `,
    [plant1.id, plant2.id, plant3.id]
  );

  await db.query(
    `
    INSERT into plants_sunlight(
        plant_id,
        sunlight_id
      )
    VALUES 
        ($1,1),
        ($2,1),
        ($2,2),
        ($3,3),
        ($3,4)
    `,
    [plant1.id, plant2.id, plant3.id]
  );

  await db.query(
    `
    INSERT into instructions(
        plant_id,
        type_id,
        description
      )
    VALUES 
        ($1,1,'Plant crops 6" apart.'),
        ($1,2,'Prune at 6 weeks.'),
        ($1,3,'Water daily. Keep soil damp.'),
        ($2,1,'Plant crops 12" apart.'),
        ($2,2,'Prune at 12 weeks.'),
        ($2,3,'Heavily water when soil is dry an inch and half deep.'),
        ($3,1,'Plant crops 24" apart.'),
        ($3,2,'Prune in the fall each year.'),
        ($3,3,'Water daily in the summer. 1-2 times per week in other seasons.')  
    `,
    [plant1.id, plant2.id, plant3.id]
  );
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
