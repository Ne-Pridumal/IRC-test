const { db } = require("../pgp");
const createCompicatedQuerySelectString = require("../utils/createComplicatedSelectString");

/**
 * Authors get method
 * @param {object} params - object with query params.
 * @param {number} params.id - author id to get.
 * @param {string} params.name - author name to get.
 * @param {string} params.surname - author surname to get, can be empty.
 * @param {number} params.birthday - year when author was born.
 * @param {age} params.age - age of author.
 */
const getAuthorsByParams = async (params) => {
  const selectedField = "select id, name, surname, extract(year from birthday), age from authors ";
  const paramsCommands = {
    name: " name ilike '%'||${name}||'%' ",
    surname: " surname ilike '%'||${surname}||'%' ",
    birthday: " extract(year from birthday)=${birthday} ",
    age: " age=${age} ",
  }
  try {
    if (params.id) {
      return db.any(selectedField + "where id=${id}", {
        id: params.id
      })
    }
    let query = selectedField
    query += createCompicatedQuerySelectString(paramsCommands, params)
    console.log(query)
    return db.any(query, params)
  }
  catch (e) {
    console.log(e)
  }
}

module.exports = getAuthorsByParams
