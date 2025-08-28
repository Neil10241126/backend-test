const { z } = require('zod')

const createUserSchema = z.object({
  name: z.string()
    .min(1, { message: 'Name must be at least 1 character' })
    .max(50, { message: 'Name must be less than 50 characters' })
    .regex(/^\S+$/, { message: 'Name must not contain spaces' }),
  email: z.string()
    .email({ message: 'Invalid email address' })
    .toLowerCase()
    .max(50, { message: 'Email must be less than 50 characters' }),
})

const updateUserSchema = createUserSchema


module.exports = {
  createUserSchema,
  updateUserSchema
 }