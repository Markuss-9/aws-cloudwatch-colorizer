export class UnreachableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnreachableError';
  }
}
