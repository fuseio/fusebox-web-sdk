export interface IIntervalStats {
  timestamp: number;
  priceChange: number;
  previousPrice: number;
  currentPrice: number;
}

export class IntervalStats implements IIntervalStats {
  timestamp: number;
  priceChange: number;
  previousPrice: number;
  currentPrice: number;

  constructor({ timestamp, priceChange, previousPrice, currentPrice }: IIntervalStats) {
    this.timestamp = timestamp;
    this.priceChange = priceChange;
    this.previousPrice = previousPrice;
    this.currentPrice = currentPrice;
  }

  static fromJson(json: Partial<IntervalStats>): IntervalStats {
    return new IntervalStats({
      timestamp: json.timestamp ?? 0,
      priceChange: json.priceChange ?? 0,
      previousPrice: json.previousPrice ?? 0,
      currentPrice: json.currentPrice ?? 0,
    });
  }

  toJson(): object {
    return {
      timestamp: this.timestamp,
      priceChange: this.priceChange,
      previousPrice: this.previousPrice,
      currentPrice: this.currentPrice,
    };
  }
}