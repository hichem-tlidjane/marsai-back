export default class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public error: object | undefined = undefined,
  ) {
    super(message);
  }
}
