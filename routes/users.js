const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers,
  getUser,
  updateAvatar,
  updateUser,
  getCurrentUser,
} = require('../controllers/users');
const errorHandler = require('../middleware/error-handler');

const regEx = require('../constants/constants');

router.get('/', getUsers);
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required(),
  }),
}), getUser);
router.get('/me', getCurrentUser);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(regEx),
  }),
}), updateAvatar);
router.use((_, res) => {
  res.status(404).json({ error: 'Not Found', message: 'User resource not found' });
});
router.use(errorHandler);

module.exports = router;
