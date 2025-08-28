const express = require('express');
const app = express();

app.use(express.json())

let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
]

// GET all users
app.get('/api/users', (req, res) => {
  res.json(users)
})

// GET a single user
app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id))

  if (!user) res.status(404).json({ message: 'User not found' })
  res.json(user)
})

// POST a new user
app.post('/api/users', (req, res) => {
  const newUser = {
    id: users.length + 1,
    name: req.body.name,
    email: req.body.email
  }
  users.push(newUser)
  res.status(201).json({ message: 'User created', user: newUser })
})

// PUT update an existing user
app.put('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id))
  if (!user) res.status(404).json({ message: 'User not found' })

  user.name = req.body.name
  user.email = req.body.email
  res.status(201).json({ message: 'User updated', user })
})

// DELETE a user
app.delete('/api/users/:id',  (req, res) => {
  const index = users.findIndex(u => u.id === parseInt(req.params.id))
  if (index === -1) res.status(404).json({ message: 'User not found' })

  users.splice(index, 1)

  res.status(201).json({ message: 'User deleted', users })
})

app.listen(8080, () => {
  console.log('Server is running on port 8080')
})