const express = require('express');
const mongoose = require('mongoose');
const usersRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');
const { createUser, login } = require('./controllers/users');
const { signInSchema, signUpSchema } = require('./middleware/validation');
const auth = require('./middleware/auth');
const { celebrateErrorHandler, errorHandler } = require('./middleware/error-handler');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

const app = express();

app.use(express.json());

app.post('/signin', signInSchema, login);
app.post('/signup', signUpSchema, createUser);
app.use(auth);
app.use('/users', usersRoutes);
app.use('/cards', cardRoutes);

app.use(errorHandler);
app.use(celebrateErrorHandler);

const { PORT = 3000 } = process.env;

app.listen(PORT, () => {
  console.log(`Server has been started on port ${PORT}`);
});
