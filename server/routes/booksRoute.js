'use strict';
const router = require('express').Router();
const { getBooksById, getBooks, createBook } = require('../controllers/booksController');

router.route("/:id").get(getBooksById)
router.route("/").get(getBooks)
router.route('/').post(createBook)

module.exports = router
