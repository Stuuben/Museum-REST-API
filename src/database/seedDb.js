//const { request } = require("express");
const { INTEGER } = require('sequelize');
const { sequelize } = require('./config')
const {museum} = require('../data/museum');
const {city } = require("../data/city");
const { user } = require("../data/user");
const { review } = require("../data/review");


sequelize.query('PRAGMA foreign_keys = ON;', { raw: true });

const seedMuseumsDb = async () => {
  try {
    // Drop tables if exist
    await sequelize.query(`DROP TABLE IF EXISTS museum;`)
    await sequelize.query(`DROP TABLE IF EXISTS city;`)
    await sequelize.query(`DROP TABLE IF EXISTS user;`)
    await sequelize.query(`DROP TABLE IF EXISTS review;`)

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
      adress TEXT,
      zipcode TEXT,
      city TEXT,
      fee INTEGER,
      fk_city_id INTEGER NOT NULL,
      FOREIGN KEY(fk_city_id) REFERENCES city(id)
      );
    `)

        // Create USER table
        await sequelize.query(`
        CREATE TABLE IF NOT EXISTS user (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_name TEXT,
          password TEXT,
          email TEXT,
          role TEXT
          );
        `)

        //Create review table
        await sequelize.query(`
        CREATE TABLE IF NOT EXISTS review (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          comment TEXT,
          grade INTERGER,
          posted_by TEXT,
          museum TEXT,
          fk_museum_id INTEGER NOT NULL,
          FOREIGN KEY(fk_museum_id) REFERENCES museum(id)
        );
        `)
        
///// CITY///////
let cityInsertQuery =
      'INSERT INTO city (name) VALUES '

    let cityInsertQueryVariables = []

    city.forEach((city, index, array) => {
        let string = '('
        for (let i = 1; i < 2; i++) {
          string += `$${cityInsertQueryVariables.length + i}`
          if (i < 1) string += ','
        }
        cityInsertQuery += string + `)`
        if (index < array.length - 1) cityInsertQuery += ','
        
        const variables = [
          city.name,
        ]

        cityInsertQueryVariables = [...cityInsertQueryVariables, ...variables]
      })
      cityInsertQuery += `;`

      await sequelize.query(cityInsertQuery, {
        bind: cityInsertQueryVariables,
      })

      const [cityRes, metadata] = await sequelize.query('SELECT name, id FROM city')

      ////////MUSEUM/////
    let museumInsertQuery =
      'INSERT INTO museum (name, adress, zipcode, city, fee, fk_city_id) VALUES '
    
    let museumInsertQueryVariables = [] 
    
    museum.forEach((museum, index, array) => {
        let string = '('
        for (let i = 1; i < 7; i++) {
          string += `$${museumInsertQueryVariables.length + i}`
          if (i < 6) string += ','
        }
        museumInsertQuery += string + ')'
        if (index < array.length - 1) museumInsertQuery += ','
  
        
  const variables = [
    museum.name,
    museum.adress,
    museum.zipcode,
    museum.city,
    museum.fee,
  ]
  
  const cityId = cityRes.find((city) => city.name === museum.city)
      variables.push(cityId.id)

      museumInsertQueryVariables = [...museumInsertQueryVariables, ...variables]
})
  museumInsertQuery += ';'

  await sequelize.query(museumInsertQuery, {
  bind: museumInsertQueryVariables,
  })

  const [museumRes, metadataMuseum] = await sequelize.query('SELECT name, id FROM museum')

///USERS
    let userInsertQuery =
      'INSERT INTO user (user_name, password, email, role) VALUES '

    let userInsertQueryVariables = []

    user.forEach((user, index, array) => {
        let string = '('
        for (let i = 1; i < 5; i++) {
          string += `$${userInsertQueryVariables.length + i}`
          if (i < 4) string += ','
        }
        userInsertQuery += string + `)`
        if (index < array.length - 1) userInsertQuery += ','
        
        const variables = [
          user.user_name,
          user.password,
          user.email,
          user.role
        ]

        userInsertQueryVariables = [...userInsertQueryVariables, ...variables]
      })
      userInsertQuery += `;`

      await sequelize.query(userInsertQuery, {
        bind: userInsertQueryVariables,
      })

   const [userRes, metadataUser] = await sequelize.query('SELECT user_name, id FROM user')

   //REVIEWS
   let reviewInsertQuery =
   'INSERT INTO review (comment, grade, posted_by, museum, fk_museum_id) VALUES '
 
 let reviewInsertQueryVariables = [] 
 
 review.forEach((review, index, array) => {
     let string = '('
     for (let i = 1; i < 6; i++) {
       string += `$${reviewInsertQueryVariables.length + i}`
       if (i < 5) string += ','
     }
     reviewInsertQuery += string + ')'
     if (index < array.length - 1) reviewInsertQuery += ','

     
const variables = [
  review.comment,
  review.grade,
  review.posted_by,
  review.museum
  
  ]

 //const userId = userRes.find((user) => user.name === review.user_name)
 //variables.push(user.user_name)

const museumId = museumRes.find((museum) => museum.name === review.museum)
   variables.push(museumId.id)


   reviewInsertQueryVariables = [...reviewInsertQueryVariables, ...variables]
})
reviewInsertQuery += ';'

    await sequelize.query(reviewInsertQuery, {
    bind: reviewInsertQueryVariables,
})



console.log('Database successfully populated with data...')
  } catch (error) {
    // Log eny eventual errors to Terminal
    console.error(error)
  } finally {
    // End Node process
    
    process.exit(0)
  }
}

seedMuseumsDb ()