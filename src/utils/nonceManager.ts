// NonceManager handle independent non-blocking UserOp transactions
export class NonceManager {
  private _nonceKey = -1

  increment = () => {
    this._nonceKey += 1
  }

  retrieve = () => {
    return this._nonceKey
  }
}
