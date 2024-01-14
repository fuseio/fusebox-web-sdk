// NonceManager handle independent non-blocking UserOp transactions
export class NonceManager {
  private _nonceKey: number = -1;

  constructor() {}

  increment = () => {
    this._nonceKey += 1;
  }

  retrieve = () => {
    return this._nonceKey;
  }
}
