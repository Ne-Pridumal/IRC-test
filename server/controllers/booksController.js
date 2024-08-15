const { getBooksByParams, insertBook, removeBook } = require("../models/booksModel");
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

const deleteBook = catchAsync(async (req, res, next) => {
  const { id } = req.body;

  const book = await getBooksByParams({ id })

  if (book.length === 0) {
    return next(new AppError("There is no book with this id", 500))
  }

  await removeBook(id);

  return res.status(200).send({
    status: "success",
    message: "Record deleted successfully"
  })
})

module.exports = { getBooksById, getBooks, createBook, deleteBook }
