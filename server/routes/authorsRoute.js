'use strict';

const { getAuthorById, getAuthors, createAuthor, deleteAuthor, patchAuthor } = require('../controllers/authorsController');

const router = require('express').Router();

router.route("/:id").get(getAuthorById)
router.route("/").get(getAuthors)
router.route('/').post(createAuthor)
router.route('/').delete(deleteAuthor)
router.route('/').patch(patchAuthor)

module.exports = router
