
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
]

// Get all users
const getUsers = async (req, res) => {
  if (users.length === 0) res.status(404).json({
    status: 404,
    code: 'NOT_FOUND',
    message: 'Users not found'
   });

  res.status(200).json({
    status: 200,
    code: 'SUCCESS',
    users
  });
}

// Get a user by id
const getUserById = async (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id))

  if (!user) res.status(404).json({
    status: 404,
    code: 'NOT_FOUND',
    message: 'User not found'
   })
  res.json({
    status: 200,
    code: 'SUCCESS',
    user
  })
}

// Create a new user
const createUser = async (req, res) => {
  const newUser = {
    id: users.length + 1,
    name: req.body.name,
    email: req.body.email
  }
  users.push(newUser)

  res.status(201).json({
    status: 201,
    code: 'CREATE_SUCCESS',
    message: 'User created successful',
  })
}

// Update a user
const updateUser = async (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id))

  if (!user) res.status(404).json({ message: 'User not found' })

  user.name = req.body.name
  user.email = req.body.email
  res.status(201).json({ message: 'User updated', user })
}

// Delete a user
const deleteUser = async (req, res) => {
  const index = users.findIndex(u => u.id === parseInt(req.params.id))

  if (index === -1) res.status(404).json({
    status: 404,
    code: 'NOT_FOUND',
    message: 'User not found'
  })

  users.splice(index, 1)
  res.status(200).json({
    status: 200,
    code: 'DELETE_SUCCESS',
    message: 'User deleted success',
  })
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
}