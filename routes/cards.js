const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const errorHandler = require('../middleware/error-handler');

router.get('/', getCards);
router.post('/', createCard);
router.delete('/', deleteCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);
router.use((_, res) => {
  res.status(404).json({ error: 'Not Found', message: 'Card resource not found' });
});
router.use(errorHandler);

module.exports = router;
