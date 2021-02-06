const express = require('express');
const User = require('../models/User');

const {
  getUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/users');

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.route('/')
  .get(advancedResults(User), getUsers)
  .post(createUser);

router.route('/:id')
  .get(getSingleUser)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;