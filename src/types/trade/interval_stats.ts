/**
 * Interface representing the statistics for a specific interval.
 */
export interface IIntervalStats {
  /** The timestamp for the interval, represented as a number. */
  timestamp: number

  /** The change in price during the interval. */
  priceChange: number

  /** The price at the start of the interval. */
  previousPrice: number

  /** The price at the end of the interval. */
  currentPrice: number
}

/**
 * Class representing the statistics for a specific interval, implementing the IIntervalStats interface.
 */
export class IntervalStats implements IIntervalStats {
  timestamp: number
  priceChange: number
  previousPrice: number
  currentPrice: number

  /**
   * Constructs a new instance of IntervalStats.
   * @param {IIntervalStats} The interval stats including timestamp, price change, previous price, and current price.
   */
  constructor({ timestamp, priceChange, previousPrice, currentPrice }: IIntervalStats) {
    this.timestamp = timestamp
    this.priceChange = priceChange
    this.previousPrice = previousPrice
    this.currentPrice = currentPrice
  }

  /**
   * Creates a new IntervalStats instance from a JSON object.
   * @param {Partial<IntervalStats>} json Partial JSON object representing interval stats.
   * @returns {IntervalStats} A new IntervalStats instance populated with data from the JSON object.
   */
  static fromJson(json: Partial<IntervalStats>): IntervalStats {
    return new IntervalStats({
      timestamp: json.timestamp ?? 0,
      priceChange: json.priceChange ?? 0,
      previousPrice: json.previousPrice ?? 0,
      currentPrice: json.currentPrice ?? 0,
    })
  }

  /**
   * Converts the IntervalStats instance to a JSON object.
   * @returns {object} JSON representation of the IntervalStats instance.
   */
  toJson(): object {
    return {
      timestamp: this.timestamp,
      priceChange: this.priceChange,
      previousPrice: this.previousPrice,
      currentPrice: this.currentPrice,
    }
  }
}
