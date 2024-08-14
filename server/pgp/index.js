const initOptions = {
  // initialization options;
  connect(e) {
    const cp = e.client.connectionParameters;
    console.log('Connected to database:', cp.database);
  },
  error(err, e) {

    if (e.cn) {
      // this is a connection-related error
      // cn = safe connection details passed into the library:
      //      if password is present, it is masked by #
    }

    if (e.query) {
      // query string is available
      if (e.params) {
        // query parameters are available
      }
    }

    if (e.ctx) {
      // occurred inside a task or transaction
    }
  }
};

const pgp = require('pg-promise')(initOptions);
const { DB_USERNAME, DB_PASSWORD, DB_NAME, DB_HOST, DB_PORT } = process.env


const cn = `postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
const db = pgp(cn);

module.exports = {
  pgp, db
}
