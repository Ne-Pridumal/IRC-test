'use strict';

require('dotenv').config()

const express = require('express');
const catchAsync = require('./utils/catchAsync');
const booksRoute = require('./routes/booksRoute');
const authorsRoute = require('./routes/authorsRoute')
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

app.use(express.json());

//setup routes
app.use('/books', booksRoute);
app.use('/authors', authorsRoute)

app.use(
  '*',
  catchAsync(async (req, res, next) => {
    throw new AppError(`Can't find ${req.originalUrl} on this server`, 404);
  })
);

app.use(globalErrorHandler);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log('Server up and running', PORT);
});
