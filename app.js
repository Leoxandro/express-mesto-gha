const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const usersRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');
const { createUser, login } = require('./controllers/users');
const { signInSchema, signUpSchema } = require('./middleware/validation');
const auth = require('./middleware/auth');
const { errorHandler } = require('./middleware/error-handler');
const { NotFoundError } = require('./utils/errors');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

const app = express();

app.use(express.json());

app.post('/signin', signInSchema, login);
app.post('/signup', signUpSchema, createUser);
app.use(auth);
app.use('/users', usersRoutes);
app.use('/cards', cardRoutes);

app.use('*', (res, req, next) => {
  next(new NotFoundError('Requested resource was not found'));
});

app.use(errors());
app.use(errorHandler);

const { PORT = 3000 } = process.env;

app.listen(PORT, () => {
  console.log(`Server has been started on port ${PORT}`);
});
