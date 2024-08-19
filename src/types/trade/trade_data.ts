export interface TradeDataParams {
  chainId: number
  estimatedPriceImpact: string
  to: string
  data: string
  value: string
  buyTokenAddress: string
  sellTokenAddress: string
  buyAmount: string
  sellAmount: string
  allowanceTarget: string
}

/**
 * Represents the data associated with a trade on a blockchain.
 *
 * This class encapsulates all necessary details needed to execute a trade, including
 * the blockchain chain ID, the impact of the trade on the price, the addresses involved,
 * and the amounts to be bought or sold.
 */
export class TradeData {
  chainId: number
  estimatedPriceImpact: string
  to: string
  data: string
  value: string
  buyTokenAddress: string
  sellTokenAddress: string
  buyAmount: string
  sellAmount: string
  allowanceTarget: string

  /**
   * Constructs a TradeData instance with detailed information about a trade.
   *
   * Includes the blockchain chainId where the trade will occur, the estimatedPriceImpact
   * which indicates the potential change in price due to the trade, to the recipient address,
   * data the payload data of the trade transaction, value the amount of native blockchain
   * currency (if any) to be sent with the transaction. It also requires the addresses of the
   * buy and sell tokens, the amounts to be bought and sold, and the allowanceTarget,
   * which is the address authorized to spend the tokens.
   */
  constructor({
    chainId,
    estimatedPriceImpact,
    to,
    data,
    value,
    buyTokenAddress,
    sellTokenAddress,
    buyAmount,
    sellAmount,
    allowanceTarget,
  }: TradeDataParams) {
    this.chainId = chainId
    this.estimatedPriceImpact = estimatedPriceImpact
    this.to = to
    this.data = data
    this.value = value
    this.buyTokenAddress = buyTokenAddress
    this.sellTokenAddress = sellTokenAddress
    this.buyAmount = buyAmount
    this.sellAmount = sellAmount
    this.allowanceTarget = allowanceTarget
  }

  /**
   * Creates a new TradeData instance from the provided JSON object.
   *
   * @param json - An object containing the JSON representation of a TradeData.
   * @returns A TradeData instance.
   */
  static fromJson(json: { [key: string]: any }): TradeData {
    const params: TradeDataParams = {
      chainId: json.chainId,
      estimatedPriceImpact: json.estimatedPriceImpact,
      to: json.to,
      data: json.data,
      value: json.value,
      buyTokenAddress: json.buyTokenAddress,
      sellTokenAddress: json.sellTokenAddress,
      buyAmount: json.buyAmount,
      sellAmount: json.sellAmount,
      allowanceTarget: json.allowanceTarget,
    }
    return new TradeData(params)
  }
}
