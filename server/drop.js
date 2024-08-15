'use strict'
require('dotenv').config()

// const path = require('path');
const { sql, db } = require("./pgp");

(async () => {
  try {
    const res = await db.one(sql('./migrations/init-db-down.sql'))
    console.log(res)
  }
  catch (e) {
    console.log(e)
  }
  process.exit(1);
})()
