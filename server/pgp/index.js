const path = require('path');
const initOptions = {
  // initialization options;
  connect(e) {
    const cp = e.client.connectionParameters;
    console.log('Connected to database:', cp.database);
  },
};

const pgp = require('pg-promise')(initOptions);
const { DB_USERNAME, DB_PASSWORD, DB_NAME, DB_HOST, DB_PORT } = process.env


const cn = `postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
const db = pgp(cn);
const sql = (file) => {
  const fullPath = path.resolve(file); // generating full path;
  return new pgp.QueryFile(fullPath, { minify: true });
}

module.exports = {
  pgp, db, sql
}
