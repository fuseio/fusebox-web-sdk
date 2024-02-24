export interface ITradeRequestBody {
  currencyIn: string;
  currencyOut: string;
  amountIn: string;
  recipient: string;
}

export class TradeRequestBody implements ITradeRequestBody {
  currencyIn: string;
  currencyOut: string;
  amountIn: string;
  recipient: string;

  constructor({ currencyIn = '', currencyOut = '', amountIn = '', recipient = '' }: Partial<ITradeRequestBody>) {
    this.currencyIn = currencyIn;
    this.currencyOut = currencyOut;
    this.amountIn = amountIn;
    this.recipient = recipient;
  }

  static fromJson(json: Partial<ITradeRequestBody>): TradeRequestBody {
    return new TradeRequestBody(json);
  }

  toJson(): object {
    return {
      currencyIn: this.currencyIn,
      currencyOut: this.currencyOut,
      amountIn: this.amountIn,
      recipient: this.recipient,
    };
  }
}
