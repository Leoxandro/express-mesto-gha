const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi } = require('celebrate');
const usersRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');
const { createUser, login } = require('./controllers/users');
const auth = require('./middleware/auth');
const regEx = require('./constants/constants');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

const app = express();

app.use(express.json());

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().pattern(regEx),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  createUser,
);

app.use(auth);
app.use('/users', (usersRoutes));
app.use('/cards', cardRoutes);
app.use((_, res) => {
  res.status(404).json({ error: 'Not found', message: 'Resource not found' });
});

const { PORT = 3000 } = process.env;

app.listen(PORT, () => {
  console.log(`Server has been started on port ${PORT}`);
});
