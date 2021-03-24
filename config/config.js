const dotenv=require('dotenv');
dotenv.config();

module.exports={
  "development": {
    "username": process.env.DBUSER,
    "password": process.env.DBPW,
    "database": "database_development",
    "host": process.env.DBENDPOINT,
    "dialect": "mysql",
    "port": process.env.DBPORT
  },
  "test": {
    "username": process.env.DBUSER,
    "password": process.env.DBPW,
    "database": "database_test",
    "host": process.env.DBENDPOINT,
    "dialect": "mysql",
    "port": process.env.DBPORT
  },
  "production": {
    "username": process.env.DBUSER,
    "password": process.env.DBPW,
    "database": "database_production",
    "host": process.env.DBENDPOINT,
    "dialect": "mysql",
    "port": process.env.DBPORT
  }
}
