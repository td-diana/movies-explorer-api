const router = require('express').Router();
const { validateUpdateUser } = require('../middlewares/validation');
const {
  getUserInfo,
  updateUser,
} = require('../controllers/users');
const { auth } = require('../middlewares/auth');

router.use(auth);
router.get('/me', getUserInfo);
router.patch('/me', validateUpdateUser, updateUser);

module.exports = router;
