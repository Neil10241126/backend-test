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

export {
  signUp
}