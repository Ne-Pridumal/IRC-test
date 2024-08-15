const { getBooksByParams, insertBook } = require("../models/booksModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");


const getBooksById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const books = await getBooksByParams({ id });

  if (!books) {
    return next(new AppError('Invalid book id', 500));
  }

  return res.status(200).send({
    status: 'success',
    data: books,
  });
});

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
});

const createBook = catchAsync(async (req, res, next) => {
  const { title, authorId, publishDate } = req.body;
  const id = await insertBook({
    title,
    authorId,
    publishDate,
  });

  if (!id) {
    return next(new AppError("Couldn't create book", 500));
  }

  return res.status(200).send({
    status: "success",
    data: id
  });
});

module.exports = { getBooksById, getBooks, createBook }
