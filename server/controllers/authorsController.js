const { getAuthorsByParams, insertAuthor, removeAuthor, updateAuthor } = require("../models/authorsModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const getAuthorById = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const authors = await getAuthorsByParams({ id })

  if (!authors) {
    return next(new AppError("Invalid author id", 400))
  }

  return res.status(200).send({
    status: "success",
    data: authors
  })
})

const getAuthors = catchAsync(async (req, res, next) => {
  const { name, surname, birthdayYear: birthday, age, page, limit } = req.query;

  const authors = await getAuthorsByParams({
    surname,
    name,
    birthday,
    age,
    page,
    limit
  })

  return res.status(200).send({
    status: "success",
    data: authors
  })
})

const createAuthor = catchAsync(async (req, res, next) => {
  const { name, surname, birthday, age } = req.body;

  const id = await insertAuthor({
    name,
    surname,
    birthday,
    age
  });

  return res.status(200).send({
    status: "success",
    data: id
  })
})

const deleteAuthor = catchAsync(async (req, res, next) => {
  const { id } = req.body;

  const author = await getAuthorsByParams({ id })

  if (author.length === 0) {
    return next(new AppError("There is no author with this id", 400))
  }

  await removeAuthor(id)

  return res.status(200).send({
    status: "success",
    message: "Record deleted successfully"
  })
})

const patchAuthor = catchAsync(async (req, res, next) => {
  const { id, author } = req.body

  const authorRes = await updateAuthor(id, author);

  return res.status(200).send({
    status: "success",
    data: authorRes
  })
})

module.exports = { getAuthors, getAuthorById, createAuthor, deleteAuthor, patchAuthor }
