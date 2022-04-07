const { Pool } = require('pg')

const db_name = "concon";

const pool = new Pool({
    user:'postgres',
    host:'localhost',
    database:db_name,
    port:5432,
});

module.exports = {
	schema: "concon",
  query: (text, params, callback) => {
    return pool.query(text, params, (err, res) => {
      callback(err, res)
    })
  },
  getClient: (callback) => {
    pool.connect((err, client, done) => {
      callback(err, client, done)
    })
  }
}
