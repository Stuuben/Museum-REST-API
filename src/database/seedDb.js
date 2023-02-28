//const { request } = require("express");
const { INTEGER } = require("sequelize");
const { sequelize } = require("./config");
//const { museum } = require("../data/museum");
//const { city } = require("../data/city");
//const { user } = require("../data/user");
//const { review } = require("../data/review");

sequelize.query("PRAGMA foreign_keys = ON;", { raw: true });

const seedMuseumsDb = async () => {
  try {
    // Drop tables if exist
    await sequelize.query(`DROP TABLE IF EXISTS user;`);
    await sequelize.query(`DROP TABLE IF EXISTS museum;`);
    await sequelize.query(`DROP TABLE IF EXISTS city;`);
    await sequelize.query(`DROP TABLE IF EXISTS review;`);

    // Create USER table
    await sequelize.query(`
        CREATE TABLE IF NOT EXISTS user (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_name TEXT,
          password TEXT,
          email TEXT,
          role TEXT
          );
        `);

    //Create city table
    await sequelize.query(`
        CREATE TABLE IF NOT EXISTS city (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL
        );
      `);

    // Create museum table
    await sequelize.query(`
    CREATE TABLE IF NOT EXISTS museum (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      address TEXT,
      zipcode TEXT,
      fk_city_id INTEGER NOT NULL,
      fee INTEGER,
      FOREIGN KEY(fk_city_id) REFERENCES city(id)
      );
    `);

    //Create review table
    await sequelize.query(`
        CREATE TABLE IF NOT EXISTS review (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          comment TEXT,
          grade INTERGER,
          posted_by TEXT,
          fk_museum_id INTEGER NOT NULL,
          FOREIGN KEY(fk_museum_id) REFERENCES museum(id)
        );
        `);

    //USERS KOPPLA OWNERS TILL MUSEUM!
    await sequelize.query(`
    INSERT INTO user (user_name, password, email, role) VALUES 
    ("admin", "password123", "admin@admin.com", "admin"), 
    ("user1", "password123", "user1@user.com", "user"), 
    ("owner_stockholm", "password123", "owner_stockholm@owner.com", "owner"),
    ("owner_göteborg", "password123", "owner_göteborg@owner.com", "owner"),
    ("owner_malmö", "password123", "owner_malmö@owner.com", "owner")
    `);

    ///// CITY///////
    await sequelize.query(`
    INSERT INTO city (name) VALUES ("Stockholm"), ("Göteborg"), ("Malmö")
    `);

    ////////MUSEUM/////
    await sequelize.query(`
    INSERT INTO museum (name, address, zipcode, fk_city_id, fee) VALUES 
    ("Vasamuseet", "Galärvarvägen 14", "115 21", (SELECT id FROM city WHERE name = 'Stockholm'), 180),
    ("ABBA Museet", "Djurgårdsvägen 68", "115 21", (SELECT id FROM city WHERE name = 'Stockholm'), 230),
    ("Volvo Museum", "Arendals skans", "405 80", (SELECT id FROM city WHERE name = 'Göteborg'), 160),
    ("Skansen", "Djurgårdsslätten 49-51", "115 21", (SELECT id FROM city WHERE name = 'Stockholm'), 185),
    ("Fotografiska", "Stadsgårdshamnen 22", "116 45", (SELECT id FROM city WHERE name = 'Stockholm'), 175),
    ("Aeroseum", "Nya Bergets Väg 5", "417 46",(SELECT id FROM city WHERE name = 'Göteborg'), 120),
    ("Nordiska museet", "Djurgårdsvägen 6-16","115 93", (SELECT id FROM city WHERE name = 'Stockholm'), 150),
    ("Avicii Experience", "Sergels Torg 2","111 57", (SELECT id FROM city WHERE name = 'Stockholm'), 220),
    ("Technology & Maritime Museum", "Malmöhusvägen 6","211 18", (SELECT id FROM city WHERE name = 'Malmö'), 40),
    ("Disgusting Food Museum", "Södra Förstadsgatan 2","211 43", (SELECT id FROM city WHERE name = 'Malmö'), 195)
    `);

    //REVIEWS
    await sequelize.query(`
    INSERT INTO review (comment, grade, posted_by, fk_museum_id) VALUES 
    ("Bästa museet i stan!", 5, "user1", (SELECT id FROM museum WHERE name = "Vasamuseet"))
    `);

    /*

          fk_city_id INTEGER NOT NULL,
      FOREIGN KEY(fk_city_id) REFERENCES city(id)



      
    let museumInsertQuery =
      "INSERT INTO museum (name, adress, zipcode, city, fee, fk_city_id) VALUES ";

    let museumInsertQueryVariables = [];

    museum.forEach((museum, index, array) => {
      let string = "(";
      for (let i = 1; i < 7; i++) {
        string += `$${museumInsertQueryVariables.length + i}`;
        if (i < 6) string += ",";
      }
      museumInsertQuery += string + ")";
      if (index < array.length - 1) museumInsertQuery += ",";

      const variables = [
        museum.name,
        museum.adress,
        museum.zipcode,
        museum.city,
        museum.fee,
      ];

      const cityId = cityRes.find((city) => city.id === museum.fk_city_id);
      variables.push(cityId.id);

      museumInsertQueryVariables = [
        ...museumInsertQueryVariables,
        ...variables,
      ];
    });
    museumInsertQuery += ";";

    await sequelize.query(museumInsertQuery, {
      bind: museumInsertQueryVariables,
    });

    const [museumRes, metadataMuseum] = await sequelize.query(
      "SELECT name, id FROM museum"
    );

    ///USERS
    let userInsertQuery =
      "INSERT INTO user (user_name, password, email, role) VALUES ";

    let userInsertQueryVariables = [];

    user.forEach((user, index, array) => {
      let string = "(";
      for (let i = 1; i < 5; i++) {
        string += `$${userInsertQueryVariables.length + i}`;
        if (i < 4) string += ",";
      }
      userInsertQuery += string + `)`;
      if (index < array.length - 1) userInsertQuery += ",";

      const variables = [user.user_name, user.password, user.email, user.role];

      userInsertQueryVariables = [...userInsertQueryVariables, ...variables];
    });
    userInsertQuery += `;`;

    await sequelize.query(userInsertQuery, {
      bind: userInsertQueryVariables,
    });

    const [userRes, metadataUser] = await sequelize.query(
      "SELECT user_name, id FROM user"
    );

    //REVIEWS
    let reviewInsertQuery =
      "INSERT INTO review (comment, grade, posted_by, museum, fk_museum_id) VALUES ";

    let reviewInsertQueryVariables = [];

    review.forEach((review, index, array) => {
      let string = "(";
      for (let i = 1; i < 6; i++) {
        string += `$${reviewInsertQueryVariables.length + i}`;
        if (i < 5) string += ",";
      }
      reviewInsertQuery += string + ")";
      if (index < array.length - 1) reviewInsertQuery += ",";

      const variables = [
        review.comment,
        review.grade,
        review.posted_by,
        review.museum,
      ];

      //const userId = userRes.find((user) => user.name === review.user_name)
      //variables.push(user.user_name)

      const museumId = museumRes.find(
        (museum) => museum.name === review.museum
      );
      variables.push(museumId.id);

      reviewInsertQueryVariables = [
        ...reviewInsertQueryVariables,
        ...variables,
      ];
    });
    reviewInsertQuery += ";";

    await sequelize.query(reviewInsertQuery, {
      bind: reviewInsertQueryVariables,
    });
    */

    console.log("Database successfully populated with data...");
  } catch (error) {
    // Log eny eventual errors to Terminal
    console.error(error);
  } finally {
    // End Node process

    process.exit(0);
  }
};

seedMuseumsDb();
