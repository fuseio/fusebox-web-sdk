/**
 * Interface defining the structure of a trade request body.
 */
export interface ITradeRequestBody {
  /** The currency being traded from. */
  currencyIn: string;
  /** The currency being traded to. */
  currencyOut: string;
  /** The amount of `currencyIn` being traded. */
  amountIn: string;
  /** The recipient address of the `currencyOut`. */
  recipient: string;
}

/**
 * Class representing a trade request body, implementing the ITradeRequestBody interface.
 */
export class TradeRequestBody implements ITradeRequestBody {
  /** The currency being traded from. */
  currencyIn: string;
  /** The currency being traded to. */
  currencyOut: string;
  /** The amount of `currencyIn` being traded. */
  amountIn: string;
  /** The recipient address of the `currencyOut`. */
  recipient: string;

  /**
   * Constructs a new TradeRequestBody instance.
   * @param {Partial<ITradeRequestBody>} params - An object containing the values to initialize the instance with, all properties are optional.
   */
  constructor({ currencyIn = '', currencyOut = '', amountIn = '', recipient = '' }: Partial<ITradeRequestBody>) {
    this.currencyIn = currencyIn;
    this.currencyOut = currencyOut;
    this.amountIn = amountIn;
    this.recipient = recipient;
  }

  /**
   * Creates a new TradeRequestBody instance from a JSON object.
   * @param {Partial<ITradeRequestBody>} json - An object containing the trade request details.
   * @returns {TradeRequestBody} A new instance of TradeRequestBody populated with the passed values.
   */
  static fromJson(json: Partial<ITradeRequestBody>): TradeRequestBody {
    return new TradeRequestBody(json);
  }

  /**
   * Converts the TradeRequestBody instance to a JSON object.
   * @returns {object} A plain object with the trade request details.
   */
  toJson(): object {
    return {
      currencyIn: this.currencyIn,
      currencyOut: this.currencyOut,
      amountIn: this.amountIn,
      recipient: this.recipient,
    };
  }
}
