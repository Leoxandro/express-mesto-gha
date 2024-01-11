const Card = require('../models/card');
const {
  NotFoundError,
  BadRequestError,
  ForbiddenError,
} = require('../utils/errors');
const {
  HTTP_CREATED,
  HTTP_OK,
} = require('../constants/constants');

const getCards = (_, res, next) => {
  Card.find({})
    .then((cards) => {
      res.status(HTTP_OK).send({ data: cards });
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;

  return Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(HTTP_CREATED).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Invalid data format'));
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Card was not found');
      }
      const ownerId = card.owner.id;
      const userId = req.user._id;

      if (ownerId !== userId) {
        throw new ForbiddenError('No permission to delete a card');
      }
      return card.remove().then(() => res.send({ data: card }));
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
      return res.status(HTTP_OK).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Invalid data format'));
      } else {
        next(err);
      }
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
      return res.status(HTTP_OK).send({ data: card });
    })
    .catch((err) => {
      if (err.ane === 'CastError') {
        next(new BadRequestError('Invalid data format'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
