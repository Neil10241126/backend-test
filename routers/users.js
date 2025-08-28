const express = require('express')
const router = express.Router()
const { createUserSchema } = require('../schemas/users')
const { validate } = require('../middleware/validate')

const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/userController')

router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', validate(createUserSchema), createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router