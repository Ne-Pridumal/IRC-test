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
    return db.any(query, params)
  }
  catch (e) {
  }
}

/**
 * Create new author in db
 * @param {object} author - author object
 * @param {string} author.name - author's name
 * @param {string} author.surname - author's surnmae, if exists
 * @param {date} author.birthday - author's birthday date
 * @param {number} author.age - author's age
 * @returns {Promise<number>} - created author id
 */
const insertAuthor = async (author) => {
  const query = "insert into authors(name, surname, birthday, age) values($1,$2,$3,$4) returning id";
  const { name, age, surname, birthday } = author
  try {
    return db.one(query, [name, surname, birthday, age])
  }
  catch (e) {

  }
}

module.exports = { getAuthorsByParams, insertAuthor }
