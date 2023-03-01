const { sequelize } = require("./config");

sequelize.query("PRAGMA foreign_keys = ON;", { raw: true });

const seedMuseumsDb = async () => {
  try {
    // Drop tables if exist
    await sequelize.query(`DROP TABLE IF EXISTS review;`);
    await sequelize.query(`DROP TABLE IF EXISTS museum;`);
    await sequelize.query(`DROP TABLE IF EXISTS city;`);
    await sequelize.query(`DROP TABLE IF EXISTS user;`);

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
          fk_user_id INTEGER NOT NULL,
          fk_museum_id INTEGER NOT NULL,
          FOREIGN KEY(fk_user_id) REFERENCES user(id),
          FOREIGN KEY(fk_museum_id) REFERENCES museum(id)
          
        );
        `);

    //USERS KOPPLA OWNERS TILL MUSEUM!
    await sequelize.query(`
    INSERT INTO user (user_name, password, email, role) VALUES 
    ("admin", "password123", "admin@admin.com", "admin")

    `);

    /* ("user1", "password123", "user1@user.com", "user"), 
    ("user2", "password123", "user2@user.com", "user"), 
    ("owner_stockholm", "password123", "owner_stockholm@owner.com", "owner"),
    ("owner_göteborg", "password123", "owner_göteborg@owner.com", "owner"),
    ("owner_malmö", "password123", "owner_malmö@owner.com", "owner") */

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
    INSERT INTO review (comment, grade, fk_user_id, fk_museum_id) VALUES 
    ("Bästa museet i stan!", 5, (SELECT id FROM user WHERE email = "admin@admin.com" ), (SELECT id FROM museum WHERE name = "Vasamuseet"))
    `);

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
