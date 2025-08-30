import argon2 from 'argon2';
import { uuidv7 } from 'uuidv7';
import query from '../db/pool.js';


/**
 * @openapi
 * /api/v1/auth/sign-up:
 *   post:
 *     tags: [Auth]
 *     summary: Sign up a new user
 *     description: Sign up a new user
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               role:
 *                 type: enum
 *                 enum:
 *                   - user
 *                   - admin
 *                 example: user
 *     responses:
 *       '201':
 *         description: "`CREATE_SUCCESS`"
 *       '400':
 *         description: "`EMAIL_EXISTS`: Email already exists"
 */
const signUp = async (req, res) => {
  const { email, password, role, userName } = req.body
  const newUserId = uuidv7()
  const hashedPassword = await argon2.hash(password, {
    type: argon2.argon2d,
    memoryCost: 64 * 1024,
    timeCost: 1,
    parallelism: 1
  })

  try {
    await query(`
      INSERT INTO users (user_id, email, password, role, user_name)
      VALUES (?, ?, ?, ?, ?);
    `, [newUserId, email, hashedPassword, role, userName])

    res.status(201).json({
      status: 201,
      code: 'CREATE_SUCCESS',
      message: 'User created successful',
    })
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        status: 400,
        code: 'EMAIL_EXISTS',
        message: 'Email 已被註冊',
      })
    }
  }
}


/**
 * @openapi
 * /api/v1/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login a new user
 *     description: Login a new user
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: "`SUCCESS`"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: number, example: 200 }
 *                 code: { type: string, example: 'SUCCESS' }
 *                 message: { type: string }
 *       '401':
 *         description: |
 *           - `EMAIL_NOT_FOUND`: Email not found
 *           - `PASSWORD_NOT_CORRECT`: Password not correct
 */
const login = async (req, res) => {
  const { email, password } = req.body

  const [rows] = await query(`
    SELECT user_id, email, password
    FROM users
    WHERE email = ?
  `, [email])

  if (rows.length === 0) {
    return res.status(401).json({
      status: 401,
      code: 'EMAIL_NOT_FOUND',
      message: 'Email not found',
    })
  }

  const user = rows[0]
  const ok = await argon2.verify(user.password, password)

  if (!ok) {
    return res.status(401).json({
      status: 401,
      code: 'PASSWORD_NOT_CORRECT',
      message: 'Password not correct',
    })
  }

  res.status(200).json({
    status: 200,
    code: 'SUCCESS',
    message: 'Sign in success',
  })
}

export {
  signUp,
  login
}