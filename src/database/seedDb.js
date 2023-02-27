//const { request } = require("express");
const { INTEGER } = require('sequelize');
const { sequelize } = require('./config')
const {museum} = require('../data/museum');

const seedMuseumsDb = async () => {
  try {
    // Drop tables if exist
    await sequelize.query(`DROP TABLE IF EXISTS museum;`)


    // Create museum table
    await sequelize.query(`
    CREATE TABLE IF NOT EXISTS museum (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      adress TEXT,
      zipcode TEXT,
      city TEXT,
      fee INTEGER
      );
    `)
    
    let museumInsertQuery =
      'INSERT INTO museum (id, name, adress, zipcode, city, fee) VALUES '

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
  //museumInsertQueryVariables = [...museumInsertQueryVariables, ...variables]
})
museumInsertQuery += ';'

await sequelize.query(museumInsertQuery, {
  //bind: museumInsertQueryVariables,
})

const [museumsRes, metadata] = await sequelize.query('SELECT name, id FROM museum')
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