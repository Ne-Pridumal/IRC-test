'use strict';

const { getAuthorById, getAuthors, createAuthor } = require('../controllers/authorsController');

const router = require('express').Router();

router.route("/:id").get(getAuthorById)
router.route("/").get(getAuthors)
router.route('/').post(createAuthor)

module.exports = router
