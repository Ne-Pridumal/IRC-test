'use strict';
const router = require('express').Router();
const { getBooksById, getBooks, createBook, deleteBook, patchBook } = require('../controllers/booksController');

router.route("/:id").get(getBooksById)
router.route("/")
  .get(getBooks)
  .post(createBook)
  .delete(deleteBook)
  .patch(patchBook)

module.exports = router
