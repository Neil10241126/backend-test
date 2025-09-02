import type { Request, Response, NextFunction } from 'express'
import { ZodTypeAny, ZodError } from 'zod'

type Target = 'body' | 'query' | 'params' | 'headers'

export default function validate(schema: ZodTypeAny, target: Target = 'body') {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const parsed = await schema.parseAsync(req[target])
      req[target] = parsed
      next()
    } catch (err) {
      const issues = err instanceof ZodError ? err.issues : []
      res.status(400).json({
        status: 400,
        code: 'VALIDATION_ERROR',
        errors: issues.map(i => ({ path: i.path, message: i.message }))
      })
    }
  }
}