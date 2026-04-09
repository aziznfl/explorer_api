export class NotFoundError extends Error {
  constructor(entity: string = 'Item') {
    super(`${entity} not found`);
    this.name = 'NotFoundError';
  }
}
