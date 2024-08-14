'use strict';

const { getAuthorById, getAuthors } = require('../controllers/authorsController');

const router = require('express').Router();

router.route("/:id").get(getAuthorById)
router.route("/").get(getAuthors)

module.exports = router
