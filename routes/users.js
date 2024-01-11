const router = require('express').Router();
const {
  getUsers,
  getUser,
  createUser,
  updateAvatar,
  updateUser,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUser);
router.post('/', createUser);
router.patch('/me/avatar', updateAvatar);
router.patch('/me', updateUser);
router.use((_, res) => {
  res.status(404).json({ error: 'Not Found', message: 'User resource not found' });
});

module.exports = router;
