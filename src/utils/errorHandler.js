class ErrorHandler extends Error {
  constructor(
    statusCode,
    msg = 'Something went wrong',
    errors = [],
    stack = ''
  ) {
    super(msg)
    this.statusCode = statusCode
    this.msg = msg
    this.data = null
    this.errors = errors
    this.success = false

    if (stack) {
      this.stack = stack
    } else {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}
export { ErrorHandler }
