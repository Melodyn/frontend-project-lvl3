export default class AppError extends Error {
  constructor(originalError, errorType) {
    super(originalError);
    this.errorType = errorType;
  }
}
