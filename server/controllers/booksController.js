const getBooksByParams = require("../models/booksModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const getBooksById = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const books = await getBooksByParams({ id })

  if (!books) {
    return next(new AppError('Invalid book id', 500));
  }

  return res.status(200).send({
    status: 'success',
    data: books,
  })
})

const getBooks = catchAsync(async (req, res, next) => {
  const { title, authorId, publishYear } = req.query;

  const books = await getBooksByParams({
    title,
    authorId,
    publishYear,
  });

  if (!books) {
    return next(new AppError('Invalid params', 500));
  }

  return res.status(200).send({
    status: "success",
    data: books
  });
})

module.exports = { getBooksById, getBooks }
