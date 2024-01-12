const User = require('../models/user');
const {
  ConflictError,
  NotFoundError,
  BadRequestError,
} = require('../utils/errors');
const {
  HTTP_STATUS_CREATED,
  HTTP_STATUS_OK,
} = require('../constants/constants');

const getUsers = (_, res, next) => {
  User.find({})
    .then((users) => {
      res.status(HTTP_STATUS_OK).send({ data: users });
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('User not found');
      }
      return res.status(HTTP_STATUS_OK).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Invalid data format'));
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
  } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(HTTP_STATUS_CREATED).send({ data: user }))
    .catch((err) => {
      if (err.name === 'MongoServerError') {
        return next(new ConflictError('User with same name already exists'));
      } if (err.name === 'ValidatonError') {
        const errorMessage = Object.values(err.errors)
          .map((error) => error.message)
          .join(', ');
        return next(new BadRequestError(`Validation error ${errorMessage}`));
      }
      return next(err);
    });
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
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('User not found');
      }
      return res.status(HTTP_STATUS_OK).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Provided info is incorrect'));
      }
      return next(err);
    });
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
        throw new NotFoundError('User not found');
      }
      return res.status(HTTP_STATUS_OK).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Provided info is incorrect'));
      }
      return next(err);
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
};
