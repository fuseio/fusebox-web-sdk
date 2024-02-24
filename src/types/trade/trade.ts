export interface ITrade {
  inputAmount: string;
  outputAmount: string;
  route: string[];
  inputToken: string;
  outputToken: string;
  executionPrice: string;
  nextMidPrice: string;
  priceImpact: string;
}

export class Trade implements ITrade {
  inputAmount: string;
  outputAmount: string;
  route: string[];
  inputToken: string;
  outputToken: string;
  executionPrice: string;
  nextMidPrice: string;
  priceImpact: string;

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