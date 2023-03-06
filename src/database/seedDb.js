const { sequelize } = require("./config");
const bcrypt = require("bcrypt");
sequelize.query("PRAGMA foreign_keys = ON;", { raw: true });

const seedMuseumsDb = async () => {
  try {
    await sequelize.query(`DROP TABLE IF EXISTS review;`);
    await sequelize.query(`DROP TABLE IF EXISTS museum;`);
    await sequelize.query(`DROP TABLE IF EXISTS city;`);
    await sequelize.query(`DROP TABLE IF EXISTS user;`);

    await sequelize.query(`
        CREATE TABLE IF NOT EXISTS user (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_name TEXT UNIQUE,
          password TEXT,
          email TEXT UNIQUE,
          role TEXT
      
          );
          
        `);

    await sequelize.query(`
        CREATE TABLE IF NOT EXISTS city (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL
        );
      `);

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

    await sequelize.query(`
        CREATE TABLE IF NOT EXISTS review (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          comment TEXT,
          grade INTERGER,
          fk_user_id INTERGER NOT NULL,
          fk_museum_id INTEGER NOT NULL,
          FOREIGN KEY(fk_user_id) REFERENCES user(id),
          FOREIGN KEY(fk_museum_id) REFERENCES museum(id)
          
          
        );
        `);

    const usersalt = await bcrypt.genSalt(10);
    const userPassword = await bcrypt.hash("password123", usersalt);

    await sequelize.query(`
    INSERT INTO user (user_name, password, email, role) VALUES 
      ("admin", "${userPassword}", "admin@admin.com", "admin"),
      ("owner", "${userPassword}", "owner@owner.com", "owner"),
      ("user", "${userPassword}", "user@user.com", "user"),
      ("user2", "${userPassword}", "user2@user.com", "user")
    `);

    await sequelize.query(`
    INSERT INTO city (name) VALUES ("Stockholm"), ("Göteborg"), ("Malmö")
    `);

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

    await sequelize.query(`
    INSERT INTO review (comment, grade, fk_user_id, fk_museum_id) VALUES 
    ("Bästa museet i stan!", 5, (SELECT id FROM user WHERE email = "admin@admin.com" ), (SELECT id FROM museum WHERE name = "Vasamuseet")),
    ("Benny var inte där...", 1, (SELECT id FROM user WHERE email = "owner@owner.com" ), (SELECT id FROM museum WHERE name = "ABBA Museet")),
    ("Miss u man! wish you where still with us!", 4, (SELECT id FROM user WHERE email = "user@user.com" ), (SELECT id FROM museum WHERE name = "Avicii Experience")),
    ("Väldigt trevligt museum. Bra pris!", 5, (SELECT id FROM user WHERE email = "admin@admin.com" ), (SELECT id FROM museum WHERE name = "ABBA Museet")),
    ("Helt okej men maten i cafét är inte att rekommendera. Åkte på magsjukan....!", 2, (SELECT id FROM user WHERE email = "user@user.com" ), (SELECT id FROM museum WHERE name = "Technology & Maritime Museum")),
    ("Not only is Skansen a delightful trip out of time in the center of a modern city, but it also provides insight into the life and Swedish culture", 5, (SELECT id FROM user WHERE email = "user@user.com" ), (SELECT id FROM museum WHERE name = "Skansen")),
    ("Trevlig personal, men svårt att parkera bilen.", 3, (SELECT id FROM user WHERE email = "user2@user.com" ), (SELECT id FROM museum WHERE name = "Disgusting Food Museum")),
    ("Väldigt Nordiskt! Hade velat ha lite mer från söder också ", 2, (SELECT id FROM user WHERE email = "user2@user.com" ), (SELECT id FROM museum WHERE name = "Nordiska museet")),
    ("Till alla flygfantaster rekommenderas Aeroseum varmt! Dom har till och med en JAS Gripen där!", 5, (SELECT id FROM user WHERE email = "user@user.com" ), (SELECT id FROM museum WHERE name = "Aeroseum")),
    ("Sjuuukt häftigt!!!", 5, (SELECT id FROM user WHERE email = "user2@user.com" ), (SELECT id FROM museum WHERE name = "Aeroseum")),
    ("Trodde de sålde kameror men ikket!", 1, (SELECT id FROM user WHERE email = "user@user.com" ), (SELECT id FROM museum WHERE name = "Fotografiska"))
    `);

    console.log("Database successfully populated with data...");
  } catch (error) {
    console.error(error);
  } finally {
    process.exit(0);
  }
};

seedMuseumsDb();
