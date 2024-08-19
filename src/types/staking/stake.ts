/**
 * Interface for stake request body parameters.
 */
export interface IStakeRequestBody {
  /** The address of the account to be staked. */
  accountAddress: string

  /** The amount of tokens to be staked, represented as a string to handle large numbers. */
  tokenAmount: string

  /** The address of the token to be staked. */
  tokenAddress: string
}

/**
 * Class representing the body of a stake request.
 */
export class StakeRequestBody implements IStakeRequestBody {
  accountAddress: string
  tokenAmount: string
  tokenAddress: string

  /**
   * Constructs a new `StakeRequestBody` instance.
   * @param params - The stake request parameters.
   * @param params.accountAddress - The address of the account to be staked.
   * @param params.tokenAmount - The amount of tokens to be staked.
   * @param params.tokenAddress - The address of the token to be staked.
   */
  constructor({ accountAddress, tokenAmount, tokenAddress }: IStakeRequestBody) {
    this.accountAddress = accountAddress
    this.tokenAmount = tokenAmount
    this.tokenAddress = tokenAddress
  }

  /**
   * Creates a `StakeRequestBody` instance from a JSON object.
   * @param json - The JSON object to parse.
   * @returns A new `StakeRequestBody` instance.
   */
  static fromJson(json: any): StakeRequestBody {
    return new StakeRequestBody({
      accountAddress: json.accountAddress,
      tokenAmount: json.tokenAmount,
      tokenAddress: json.tokenAddress,
    })
  }

  /**
   * Converts the `StakeRequestBody` instance to a JSON object.
   * @returns A JSON representation of the instance.
   */
  toJson(): object {
    return {
      accountAddress: this.accountAddress,
      tokenAmount: this.tokenAmount,
      tokenAddress: this.tokenAddress,
    }
  }
}

/**
 * Interface for stake response body parameters.
 */
export interface IStakeResponseBody {
  /** The address of the staking contract. */
  contractAddress: string

  /** The encoded Application Binary Interface (ABI) for the staking operation. */
  encodedABI: string
}

/**
 * Class representing the body of a stake response.
 */
export class StakeResponseBody implements IStakeResponseBody {
  contractAddress: string
  encodedABI: string

  /**
   * Constructs a new `StakeResponseBody` instance.
   * @param params - The stake response parameters.
   * @param params.contractAddress - The address of the staking contract.
   * @param params.encodedABI - The encoded ABI for the staking operation.
   */
  constructor({ contractAddress, encodedABI }: IStakeResponseBody) {
    this.contractAddress = contractAddress
    this.encodedABI = encodedABI
  }

  /**
   * Creates a `StakeResponseBody` instance from a JSON object.
   * @param json - The JSON object to parse.
   * @returns A new `StakeResponseBody` instance.
   */
  static fromJson(json: any): StakeResponseBody {
    return new StakeResponseBody({
      contractAddress: json.contractAddress,
      encodedABI: json.encodedABI,
    })
  }

  /**
   * Converts the `StakeResponseBody` instance to a JSON object.
   * @returns A JSON representation of the instance.
   */
  toJson(): object {
    return {
      contractAddress: this.contractAddress,
      encodedABI: this.encodedABI,
    }
  }
}
