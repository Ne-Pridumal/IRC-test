'use strict';
const router = require('express').Router();
const { getBooksById, getBooks, createBook, deleteBook } = require('../controllers/booksController');

router.route("/:id").get(getBooksById)
router.route("/").get(getBooks)
router.route('/').post(createBook)
router.route('/').delete(deleteBook)

module.exports = router
