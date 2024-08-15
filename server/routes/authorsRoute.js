'use strict';

const { getAuthorById, getAuthors, createAuthor, deleteAuthor } = require('../controllers/authorsController');

const router = require('express').Router();

router.route("/:id").get(getAuthorById)
router.route("/").get(getAuthors)
router.route('/').post(createAuthor)
router.route('/').delete(deleteAuthor)

module.exports = router
