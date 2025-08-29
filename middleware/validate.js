const validate = (schema, source = 'body') => (
  req,
  res,
  next
) => {
  const result = schema.safeParse(req[source])

  if (!result.success) {
    const errors = result.error.issues.map(i => ({
      message: i.message
    }))

    return res.status(422).json({
      status: 422,
      code: 'VALIDATION_ERROR',
      message: 'Validation failed',
      errors
    })
  }

  req[source] = result.data
  next()
}

export { validate }