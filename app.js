const express = require('express');
const mongoose = require('mongoose');
const usersRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '659a9fc1010cd4b3b116b8d5',
  };

  next();
});

app.use('/users', (usersRoutes));
app.use('/cards', cardRoutes);

const { PORT = 3000 } = process.env;

app.listen(PORT, () => {
  console.log(`Server has been started on port ${PORT}`);
});
