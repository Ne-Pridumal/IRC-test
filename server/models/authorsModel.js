const { db, pgp, PgErrors } = require("../pgp");
const AppError = require("../utils/appError");
const createCompicatedQuerySelectString = require("../utils/createComplicatedSelectString");

/**
 * Authors get method
 * @param {object} params - object with query params
 * @param {number} params.id - author id to get
 * @param {string} params.name - author name to get
 * @param {string} params.surname - author surname to get, can be empty
 * @param {number} params.birthday - year when author was born
 * @param {number} params.age - age of author
 * @param {number} [params.page = 1] - query page
 * @param {number} [params.limit = 10] - query limit per page
 */
const getAuthorsByParams = async (params) => {
  const { page = 1, limit = 10 } = params
  const { count: authorAmount } = await db.one("select count(*) from authors")
  const pageSize = Math.floor(Number(authorAmount) / limit)
  const offset = isNaN(pageSize) ? 0 : pageSize * (page - 1)

  const selectedField = "select id, name, surname, extract(year from birthday), age from authors ";
  const paramsCommands = {
    name: " name ilike '%'||${name}||'%' ",
    surname: " surname ilike '%'||${surname}||'%' ",
    birthday: " extract(year from birthday)=${birthday} ",
    age: " age=${age} ",
  }

  if (params.id) {
    return db.any(selectedField + "where id=${id}", {
      id: params.id
    })
  }

  let query = selectedField
  query += createCompicatedQuerySelectString(paramsCommands, params)
  query += ` limit ${limit < 0 ? 0 : limit} offset ${isNaN(offset) ? 0 : offset}`

  try {
    return await db.any(query, params)
  } catch (e) {
    throw new AppError("transaction error", 500)
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
  const { insert, ColumnSet } = pgp.helpers;
  const cs = new ColumnSet(["name", "surname", "birthday", "age"], { table: "authors" })
  let query = ""

  try {
    query = insert(author, cs) + " returning id";
    return await db.one(query)
  }
  catch (e) {
    if (e.code === PgErrors.EXEC_CONSTRAINTS) {
      throw new AppError("Wrong params", 400)
    }
    throw new AppError("Transaction error", 500)
  }
}

/**
 * Remove author from db
 * @param {number} id - author's id
 */
const removeAuthor = async (id) => {
  const query = 'delete from authors where id=${id}'

  try {
    return await db.none(query, {
      id
    })
  } catch (e) {
    throw new AppError("transaction error", 500)
  }
}

/**
 * Update author by id
 * @param {number} id - book's id
 * @param {string} author.name - change author's name
 * @param {string} author.surname - change author's surname
 * @param {number} author.birthday - change author's birthday
 * @param {age} author.age - change author's age
 * @returns {Promise<object>} - updated book
 */
const updateAuthor = async (id, author) => {
  const { update, ColumnSet } = pgp.helpers;
  const condition = pgp.as.format(" where id=${id} ", { id })
  const cs = new ColumnSet([
    {
      name: "name",
      skip: c => !c.value
    },
    {
      name: "surname",
      skip: c => !c.value
    },
    {
      name: "birthday",
      skip: c => !c.value
    },
    {
      name: "age",
      skip: c => !c.value
    },
  ],
    {
      table: "authors"
    })
  let query = ""

  try {
    query = update(author, cs) + condition + "returning id, name, surname, birthday, age"
  }
  catch (e) {
    throw new AppError("wrong params", 400)
  }

  try {
    return await db.one(query)
  } catch (e) {
    throw new AppError("transaction error", 500)
  }
}

module.exports = { getAuthorsByParams, insertAuthor, removeAuthor, updateAuthor }
