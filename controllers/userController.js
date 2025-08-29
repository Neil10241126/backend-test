
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
]

/**
 * @openapi
 * /api/v1/users:
 *   get:
 *     tags: [Users]
 *     summary: List users
 *     description: 取得所有使用者
 *     responses:
 *       '200':
 *         description: "`SUCCESS`"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                     description: 使用者 ID
 *                     example: 1
 *                   name:
 *                     type: string
 *                     description: 使用者名稱
 *                     example: John Doe
 *                   email:
 *                     type: string
 *                     format: email
 *                     example: john@example.com
 *       '404':
 *         description: "`NOT_FOUND`: Users not found"
 *       '500':
 *         description: "`SERVER_ERROR`: Internal server error"
 */
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

/**
 * @openapi
 * /api/v1/users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Get user by id
 *     parameters:
 *       - in: path
 *         name: id
 *         description: 使用者 ID
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       '200':
 *         description: "`SUCCESS`"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id: { type: string, format: uuid }
 *                 name: { type: string }
 *                 email: { type: string, format: email }
 *       '404':
 *         description: "`NOT_FOUND`: User not found"
 */
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

/**
 * @openapi
 * /api/v1/users:
 *   post:
 *     tags: [Users]
 *     summary: Create a new user
 *     description: Create a new user
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *     responses:
 *       '201':
 *         description: "`CREATE_SUCCESS`"
 */
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

/**
 * @openapi
 * /api/v1/users/{id}:
 *   put:
 *     tags: [Users]
 *     summary: Update a user by id
 *     description: Update a user by id
  *     parameters:
 *       - in: path
 *         name: id
 *         description: 使用者 ID
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *     responses:
 *       '201':
 *         description: "`UPDATE_SUCCESS`"
 *       '404':
 *         description: "`NOT_FOUND`: User not found"
 */
const updateUser = async (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id))

  if (!user) res.status(404).json({ message: 'User not found' })

  user.name = req.body.name
  user.email = req.body.email
  res.status(201).json({
    status: 201,
    code: 'UPDATE_SUCCESS',
    message: 'User updated successful',
  })
}

/**
 * @openapi
 * /api/v1/users/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Delete a user by id
 *     description: Delete a user by id
  *     parameters:
 *       - in: path
 *         name: id
 *         description: 使用者 ID
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       '200':
 *         description: "`DELETE_SUCCESS`"
 *       '404':
 *         description: "`NOT_FOUND`: User not found"
 */
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

export {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
}