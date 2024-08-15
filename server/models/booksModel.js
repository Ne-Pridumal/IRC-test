'use strict';
const { db } = require('../pgp');
const createCompicatedQuerySelectString = require('../utils/createComplicatedSelectString');

/**
 * Books get method.
 * @param {object} params - object with query params
 * @param {number} params.id - get one book with provided id
 * @param {string} params.title - gets only that books which includes "title"
 * @param {number} params.authorId - gets books which were written by author with certain id
 * @param {number} params.publishYear - gets books by publish year
 * @returns {Promise<Array>} return books array
 */
const getBooksByParams = async (params) => {
  const selectedFields = 'select id, title, author_id, extract(year from creation_date) from books '
  const paramsCommands = {
    authorId: " author_id=${authorId} ",
    publishYear: " extract(year from creation_date)=${publishYear} ",
    title: " title ilike '%'||${title}||'%' "
  }
  try {
    if (params.id) {
      return db.any(selectedFields + "where id=${id}", {
        id: params.id
      });
    }
    let query = selectedFields;
    query += createCompicatedQuerySelectString(paramsCommands, params);
    return db.any(query, params)
  }
  catch (e) {
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
  const { title, authorId, publishDate } = book
  const query = 'insert into books(title, author_id, creation_date) values($1, $2, $3) returning id'
  try {
    return db.one(query, [title, authorId, publishDate]).catch(e => console.log(e))
  }
  catch (e) {
    console.log(e)
  }
}

module.exports = { getBooksByParams, insertBook }
