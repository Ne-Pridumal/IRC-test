'use strict';
const { db, pgp, PgErrors } = require('../pgp');
const AppError = require('../utils/appError');
const createCompicatedQuerySelectString = require('../utils/createComplicatedSelectString');

/**
 * Books get method.
 * @param {object} params - object with query params
 * @param {number} params.id - get one book with provided id
 * @param {string} params.title - gets only that books which includes "title"
 * @param {number} params.authorId - gets books which were written by author with certain id
 * @param {number} params.publishYear - gets books by publish year
 * @param {number} [params.page = 1] - query page
 * @param {number} [params.limit = 10] - query limit per page
 * @returns {Promise<Array>} return books array
 */
const getBooksByParams = async (params) => {
  const { page = 1, limit = 10 } = params
  const { count: booksAmount } = await db.one("select count(*) from books")
  const pageSize = Math.floor(Number(booksAmount) / limit)
  const offset = page - 1 < 0 ? 0 : pageSize * (page - 1)

  const selectedFields = 'select id, title, author_id, extract(year from publish_date) from books '
  const paramsCommands = {
    authorId: " author_id=${authorId} ",
    publishYear: " extract(year from publish_date)=${publishYear} ",
    title: " title ilike '%'||${title}||'%' "
  }

  if (params.id) {
    return db.any(selectedFields + "where id=${id}", {
      id: params.id
    });
  }

  let query = selectedFields;
  query += createCompicatedQuerySelectString(paramsCommands, params);
  query += ` limit ${limit < 0 ? 0 : limit} offset ${isNaN(offset) ? 0 : offset}`

  try {
    return await db.any(query, params)
  } catch (e) {
    throw new AppError("transaction error", 500)
  }
}


/**
 * Create new book in db
 * @param {object} book - book object
 * @param {string} book.title - book title field
 * @param {number} book.authorId - book's author
 * @param {date} book.publishDate - book's publish year
 * @returns {Promise<number>} - created book id
 */
const insertBook = async (book) => {
  const { insert, ColumnSet } = pgp.helpers
  const cs = new ColumnSet([
    "title",
    {
      name: "author_id",
      prop: "authorId"
    },
    {
      name: "publish_date",
      prop: "publishDate"
    }
  ],
    {
      table: "books"
    }
  )
  let query = ""
  try {
    query = insert(book, cs) + "returning id";
  }
  catch (e) {
    throw new AppError("wrong params", 400)
  }
  try {
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
 * Remove book from bd
 * @param {number} id - book's id
 */
const removeBook = async (id) => {
  const query = 'delete from books where id=${id}'
  try {
    return await db.none(query, {
      id
    })
  } catch (e) {
    throw new AppError("transaction error", 500)
  }
}


/**
 * Update book by id
 * @param {number} id - book's id
 * @param {object} book - new book params
 * @param {string} book.title - new title
 * @param {date} book.publishDate - new publish date
 * @param {number} book.authorId - change author
 * @returns {Promise<object>} - updated book
 */
const updateBook = async (id, book) => {
  const { update, ColumnSet } = pgp.helpers
  const condition = pgp.as.format(" where id=${id} ", { id })
  const cs = new ColumnSet([
    {
      name: "title",
      skip: c => !c.value,
    },
    {
      name: "author_id",
      prop: "authorId",
      skip: c => !c.value,
    },
    {
      name: "publish_date",
      prop: "publishDate",
      skip: c => !c.value,
    },
  ],
    {
      table: "books",
    })
  let query = ""

  try {
    query = update(book, cs) + condition + "returning id, title, author_id, publish_date"
  } catch (e) {
    throw new AppError("wrong params", 400)
  }

  try {
    return await db.one(query)
  } catch (e) {
    throw new AppError("transaction error", 500)
  }
}

module.exports = { getBooksByParams, insertBook, removeBook, updateBook }
