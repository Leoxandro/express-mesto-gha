const User = require('../models/user');

const getUsers = (_, res, next) => {
  User.find({})
    .then((users) => {
      res.status(200).send({ data: users });
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        console.log('User not found');
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => next(err));
};

const createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
  } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: `Error creating new user, status ${err.message}` }));
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  return User.findByIdAndUpdate(
    req.user._id,
    {
      name,
      about,
    },
    {
      new: true,
    },
  )
    .then((user) => {
      if (!user) {
        console.log('User not found');
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => next(err));
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    {
      avatar,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        console.log('User not found');
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => next(err));
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
};
