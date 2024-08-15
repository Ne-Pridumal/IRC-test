'use strict';
const router = require('express').Router();
const { getBooksById, getBooks, createBook, deleteBook, patchBook } = require('../controllers/booksController');

router.route("/:id").get(getBooksById)
router.route("/").get(getBooks)
router.route('/').post(createBook)
router.route('/').delete(deleteBook)
router.route('/').patch(patchBook)

module.exports = router
