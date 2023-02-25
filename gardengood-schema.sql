CREATE TABLE plants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    species TEXT NOT NULL,
    img_url TEXT NOT NULL,
    is_perrenial BOOLEAN NOT NULL,
    description TEXT NOT NULL,
    days_to_maturity_min INT,
    days_to_maturity_max INT
);

CREATE TABLE seasons (
    id SERIAL PRIMARY KEY,
    name VARCHAR(25) NOT NULL
);

CREATE TABLE plants_seasons (
    plant_id INT
      REFERENCES plants ON DELETE CASCADE,
    season_id INT
      REFERENCES seasons ON DELETE CASCADE,
    PRIMARY KEY (plant_id, season_id)
);

CREATE TABLE sunlight (
    id SERIAL PRIMARY KEY,
    name VARCHAR(25) NOT NULL,
    description TEXT NOT NULL
);

CREATE TABLE plants_sunlight (
    plant_id INT
      REFERENCES plants ON DELETE CASCADE,
    sunlight_id INT
      REFERENCES sunlight ON DELETE CASCADE,
    PRIMARY KEY (plant_id, sunlight_id)
);

CREATE TABLE instruction_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(25) NOT NULL
);

CREATE TABLE instructions (
    plant_id INT 
      REFERENCES plants ON DELETE CASCADE,
    type_id INT 
      REFERENCES instruction_types,
    description TEXT NOT NULL,
    PRIMARY KEY (plant_id, type_id)
);

CREATE TABLE users (
  username VARCHAR(25) PRIMARY KEY,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL
    CHECK (position('@' IN email) > 1),
  zip_code INT,
  created_at TIMESTAMP,
  last_login_at TIMESTAMP,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE
);


CREATE TABLE gardens (
    id SERIAL PRIMARY KEY,
    name VARCHAR(25) NOT NULL,
    description TEXT
);

CREATE TABLE users_gardens (
    username VARCHAR(25) NOT NULL
      REFERENCES users ON DELETE CASCADE,
    garden_id INT NOT NULL
      REFERENCES gardens ON DELETE CASCADE,
      PRIMARY KEY (username, garden_id)
);

CREATE TABLE beds (
    id SERIAL PRIMARY KEY,
    name VARCHAR(25) NOT NULL,
    garden_id INT NOT NULL
      REFERENCES gardens ON DELETE CASCADE
);

CREATE TABLE crops (
    id SERIAL PRIMARY KEY,
    plant_id INT NOT NULL
      REFERENCES plants ON DELETE CASCADE,
    bed_id INT NOT NULL
        REFERENCES beds ON DELETE CASCADE,
    qty INT NOT NULL,
    planted_at TIMESTAMP
);

CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    crop_id INT NOT NULL,
    created_at TIMESTAMP,
    title VARCHAR(25),
    description TEXT NOT NULL
);