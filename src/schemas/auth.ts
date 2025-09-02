import { z } from 'zod';

export const signUpSchema = z.object({
  email: z.string()
    .email({ message: 'Invalid email address' })
    .toLowerCase()
    .max(50, { message: 'Email must be less than 50 characters' })
    .regex(/^\S+$/, { message: 'Email must not contain spaces' }),
  password: z.string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .max(50, { message: 'Password must be less than 50 characters' })
    .regex(/^\S+$/, { message: 'Password must not contain spaces' }),
  role: z.enum(['user', 'admin'], { message: 'Invalid role' }),
  userName: z.string()
    .min(1, { message: 'User name must be at least 1 character' })
    .max(50, { message: 'User name must be less than 50 characters' })
    .regex(/^\S+$/, { message: 'User name must not contain spaces' }),
})

export const loginSchema = z.object({
  email: z.string()
    .email({ message: 'Invalid email address' })
    .toLowerCase()
    .max(50, { message: 'Email must be less than 50 characters' })
    .regex(/^\S+$/, { message: 'Email must not contain spaces' }),
  password: z.string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .max(50, { message: 'Password must be less than 50 characters' })
    .regex(/^\S+$/, { message: 'Password must not contain spaces' }),
})

export const UpdatePasswordSchema = z.object({
  password: z.string().min(6)
})

export type SignUpSchema = z.infer<typeof signUpSchema>
export type LoginSchema = z.infer<typeof loginSchema>
export type UpdatePasswordSchema = z.infer<typeof UpdatePasswordSchema>