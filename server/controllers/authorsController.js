const getAuthorsByParams = require("../models/authorsModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const getAuthorById = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const authors = await getAuthorsByParams({ id })

  if (!authors) {
    return next(new AppError("Invalid author id", 500))
  }

  return res.status(200).send({
    status: "success",
    data: authors
  })
})

const getAuthors = catchAsync(async (req, res, next) => {
  const { name, surname, birthdayYear: birthday, age } = req.query;

  const authors = await getAuthorsByParams({
    surname,
    name,
    birthday,
    age,
  })

  if (!authors) {
    return next(new AppError("Invalid params", 500))
  }

  return res.status(200).send({
    status: "success",
    data: authors
  })
})

module.exports = { getAuthors, getAuthorById }
