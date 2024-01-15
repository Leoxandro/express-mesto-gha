const Card = require('../models/card');
const {
  NotFoundError,
  BadRequestError,
  ForbiddenError,
} = require('../utils/errors');
const {
  HTTP_STATUS_CREATED,
  HTTP_STATUS_OK,
} = require('../constants/constants');

const getCards = (_, res, next) => {
  Card.find({})
    .then((cards) => {
      res.status(HTTP_STATUS_OK).send({ data: cards });
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;

  return Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(HTTP_STATUS_CREATED).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Invalid data format'));
      }
      return next(err);
    });
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Card was not found');
      }
      const ownerId = card.owner.toString();
      const userId = req.user._id;

      if (ownerId !== userId) {
        throw new ForbiddenError('No permission to delete a card');
      }
      return card.deleteOne().then(() => res.send({ data: card }));
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Card was not found');
      }
      return res.status(HTTP_STATUS_OK).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Invalid data format'));
      }
      return next(err);
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Card was not found');
      }
      return res.status(HTTP_STATUS_OK).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Invalid data format'));
      }
      return next(err);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
