/**
 * Interface for trade details.
 */
export interface ITrade {
  /** The amount of input token. */
  inputAmount: string;

  /** The amount of output token. */
  outputAmount: string;

  /** A list of strings representing the route of the trade. */
  route: string[];

  /** The input token of the trade.. */
  inputToken: string;

  /** The output token of the trade. */
  outputToken: string;

  /** The execution price of the trade. */
  executionPrice: string;

  /** The next mid price of the trade. */
  nextMidPrice: string;

  /** The price impact of the trade. */
  priceImpact: string;
}

/**
 * Class representing a trade.
 */
export class Trade implements ITrade {
  inputAmount: string;
  outputAmount: string;
  route: string[];
  inputToken: string;
  outputToken: string;
  executionPrice: string;
  nextMidPrice: string;
  priceImpact: string;

  /**
   * Creates an instance of a trade.
   * @param params - The trade parameters.
   */
  constructor({
    inputAmount,
    outputAmount,
    route,
    inputToken,
    outputToken,
    executionPrice,
    nextMidPrice,
    priceImpact,
  }: ITrade) {
    this.inputAmount = inputAmount;
    this.outputAmount = outputAmount;
    this.route = route;
    this.inputToken = inputToken;
    this.outputToken = outputToken;
    this.executionPrice = executionPrice;
    this.nextMidPrice = nextMidPrice;
    this.priceImpact = priceImpact;
  }

  /**
   * Creates a new trade instance from a JSON object.
   * @param json - Partial JSON representation of a trade.
   * @returns A new Trade instance.
   */
  static fromJson(json: Partial<Trade>): Trade {
    return new Trade({
      inputAmount: json.inputAmount ?? '',
      outputAmount: json.outputAmount ?? '',
      route: json.route ?? [],
      inputToken: json.inputToken ?? '',
      outputToken: json.outputToken ?? '',
      executionPrice: json.executionPrice ?? '',
      nextMidPrice: json.nextMidPrice ?? '',
      priceImpact: json.priceImpact ?? '',
    });
  }

  /**
   * Converts the trade instance to a JSON object.
   * @returns The JSON representation of the trade.
   */
  toJson(): object {
    return {
      inputAmount: this.inputAmount,
      outputAmount: this.outputAmount,
      route: this.route,
      inputToken: this.inputToken,
      outputToken: this.outputToken,
      executionPrice: this.executionPrice,
      nextMidPrice: this.nextMidPrice,
      priceImpact: this.priceImpact,
    };
  }
}
