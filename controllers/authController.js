import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
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
    SELECT user_id, email, password, role
    FROM users
    WHERE email = ?
  `, [email])

  if (rows.length === 0) res.status(401).json({ code: 'EMAIL_NOT_FOUND' })

  const user = rows[0]
  const ok = await argon2.verify(user.password, password)

  if (!ok) res.status(401).json({  code: 'PASSWORD_NOT_CORRECT' })

  const accessToken = jwt.sign(
    { userId: user.user_id, role: user.role },
    process.env.JWT_SECRET,
    {
      algorithm: 'HS256',
      expiresIn: '10m',
      issuer: process.env.JWT_ISS,
      audience: process.env.JWT_ACCESS_AUD
    }
  )

  const refreshToken = jwt.sign(
    { userId: user.user_id, role: user.role },
    process.env.JWT_SECRET,
    {
      algorithm: 'HS256',
      expiresIn: '7d',
      issuer: process.env.JWT_ISS,
      audience: process.env.JWT_REFRESH_AUD
    }
  )

  res.status(200).json({
    status: 200,
    code: 'SUCCESS',
    message: 'Sign in success',
    accessToken,
    refreshToken,
  })
}


/**
 * @openapi
 * /api/v1/auth/refresh-token:
 *   post:
 *     tags: [Auth]
 *     summary: Refresh a token
 *     description: Refresh a token
 *     security:
 *       - bearerAuth: []
 *
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
 *           - `REFRESH_TOKEN_NOT_FOUND`: Refresh token not found
 *           - `REFRESH_TOKEN_EXPIRED`: Refresh token expired
 *           - `REFRESH_TOKEN_INVALID`: Refresh token invalid
 */
const refreshToken = async (req, res) => {
  const auth = req.headers.authorization || ''
  const refreshToken = auth.startsWith('Bearer ') ? auth.split(' ')[1] : null

  if(!refreshToken) res.status(401).json({ code: 'REFRESH_TOKEN_NOT_FOUND' })

  try {
    const decodedJWT = jwt.verify(refreshToken, process.env.JWT_SECRET, {
      algorithms: ['HS256'],
      issuer: process.env.JWT_ISS,
      audience: process.env.JWT_REFRESH_AUD
    })
    const { userId, role } = decodedJWT

    res.json({
      status: 200,
      code: 'SUCCESS',
      accessToken: jwt.sign(
        { userId, role },
        process.env.JWT_SECRET,
        {
          algorithm: 'HS256',
          expiresIn: '10m',
          issuer: process.env.JWT_ISS,
          audience: process.env.JWT_ACCESS_AUD
        }
      )
    })
  } catch (err) {
    if (err.name === 'TokenExpiredError') res.status(401).json({ code: 'REFRESH_TOKEN_EXPIRED' })
    if (err.name === 'JsonWebTokenError') res.status(401).json({ code: 'REFRESH_TOKEN_INVALID' })
  }
}

export {
  signUp,
  login,
  refreshToken
}