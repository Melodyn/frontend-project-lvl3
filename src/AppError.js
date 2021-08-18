export default class AppError extends Error {
  constructor(errorType, originalError = '') {
    super(originalError);
    this.errorType = errorType;
  }
}
