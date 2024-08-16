'use strict';

const { getAuthorById, getAuthors, createAuthor, deleteAuthor, patchAuthor } = require('../controllers/authorsController');

const router = require('express').Router();

router.route("/:id").get(getAuthorById)
router.route("/")
  .get(getAuthors)
  .post(createAuthor)
  .delete(deleteAuthor)
  .patch(patchAuthor)

module.exports = router
