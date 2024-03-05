import { BigNumberish } from "ethers";
import { ContractUtils } from "../../utils/contracts";

/**
 * Represents the body of a trade request.
 *
 * This class includes necessary details such as the input and output currencies,
 * and the amount to be traded. It supports operations for both exact input and
 * exact output trading scenarios.
 */
export class TradeRequest {
  inputToken: string;
  outputToken: string;
  inputAmount: BigNumberish;
  exactIn: boolean;

  /**
   * Constructs a TradeRequest with the required parameters.
   *
   * @param inputToken - The address of the input token.
   * @param outputToken - The address of the output token.
   * @param inputAmount - Specifies the amount of the input token to be traded.
   * @param exactIn - Determines the type of trade (exact input or exact output).
   */
  constructor(inputToken: string, outputToken: string, inputAmount: BigNumberish, exactIn: boolean) {
    this.inputToken = inputToken;
    this.outputToken = outputToken;
    this.inputAmount = inputAmount;
    this.exactIn = exactIn;
  }

  /**
   * Generates a map of parameters for making API requests based on the trade details.
   *
   * Depending on the exactIn flag, it sets up the parameters differently for
   * exact input or exact output trades. For exact input trades, the sell amount is specified,
   * and for exact output trades, the buy amount is specified.
   *
   * @returns A map of the trade parameters.
   */
  getParams(): Record<string, any> {
    return this.exactIn
      ? {
        'sellToken': this.getToken(this.inputToken),
        'buyToken': this.getToken(this.outputToken),
        'sellAmount': this.inputAmount.toString(),
      }
      : {
        'buyToken': this.getToken(this.outputToken),
        'sellToken': this.getToken(this.inputToken),
        'buyAmount': this.inputAmount.toString(),
      };
  }

  /**
   * Resolves the token address to a more human-readable form if applicable.
   *
   * If the token address corresponds to a native token, this method returns a predefined
   * string ('FUSE' in this case). Otherwise, it returns the token address as-is. This is
   * useful for APIs that require token identifiers in a specific format.
   *
   * @param tokenAddress - The address of the token.
   * @returns The human-readable form of the token address or the address itself.
   */
  private getToken(tokenAddress: string): string {
    return ContractUtils.isNativeToken(tokenAddress) ? 'FUSE' : tokenAddress;
  }

  /**
   * Creates a new TradeRequest instance from the provided JSON object.
   *
   * @param json - An object containing the JSON representation of a TradeRequest.
   * @returns A TradeRequest instance.
   */
  static fromJson(json: { [key: string]: any }): TradeRequest {
    return new TradeRequest(json.inputToken, json.outputToken, BigInt(json.inputAmount), json.exactIn);
  }
}
