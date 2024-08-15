require('dotenv').config()

const { sql, db } = require("./pgp");

(async () => {
  try {
    const res = await db.one(sql('./migrations/init-db-up.sql'))
    console.log(res)
  }
  catch (e) {
    console.log(e)
  }
  process.exit(1);
})()
