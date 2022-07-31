export class ApiError extends Error {
  error: Error
  constructor(message: string, error: Error) {
    super(message)
    this.error = error
    Object.setPrototypeOf(this, ApiError.prototype)
  }
}
