'use strict';
const router = require('express').Router();
const { getBooksById, getBooks } = require('../controllers/booksController');

router.route("/:id").get(getBooksById)
router.route("/").get(getBooks)

module.exports = router
