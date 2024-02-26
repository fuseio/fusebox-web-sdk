/**
 * Interface representing the request body for unstaking tokens.
 */
export interface IUnstakeRequestBody {
  /** The account address. */
  accountAddress: string;
  /** The amount of tokens to be unstaked. */
  tokenAmount: string;
  /** The address of the token contract. */
  tokenAddress: string;
}

/**
 * Class representing the request body for unstaking tokens.
 * Implements {@link IUnstakeRequestBody}.
 */
export class UnstakeRequestBody implements IUnstakeRequestBody {
  /** @inheritdoc */
  accountAddress: string;
  /** @inheritdoc */
  tokenAmount: string;
  /** @inheritdoc */
  tokenAddress: string;

  /**
   * Constructs a new instance of the UnstakeRequestBody class.
   * @param params - The {@link IUnstakeRequestBody} parameters for unstaking.
   */
  constructor({ accountAddress, tokenAmount, tokenAddress }: IUnstakeRequestBody) {
    this.accountAddress = accountAddress;
    this.tokenAmount = tokenAmount;
    this.tokenAddress = tokenAddress;
  }

  /**
   * Creates a new instance of the UnstakeRequestBody class from a JSON object.
   * @param json - The JSON object representing the UnstakeRequestBody.
   * @returns A new instance of the UnstakeRequestBody class.
   */
  static fromJson(json: any): UnstakeRequestBody {
    return new UnstakeRequestBody(json);
  }

  /**
   * Converts the UnstakeRequestBody instance to a JSON object.
   * @returns The JSON representation of the UnstakeRequestBody instance.
   */
  toJson(): object {
    return {
      accountAddress: this.accountAddress,
      tokenAmount: this.tokenAmount,
      tokenAddress: this.tokenAddress,
    };
  }
}

/**
 * Interface representing the response body for an unstake operation.
 */
export interface IUnstakeResponseBody {
  /** The smart contract address. */
  contractAddress: string;
  /** The encoded ABI (Application Binary Interface). */
  encodedABI: string;
}

/**
 * Class representing the response body for an unstake operation.
 * Implements {@link IUnstakeResponseBody}.
 */
export class UnstakeResponseBody implements IUnstakeResponseBody {
  /** @inheritdoc */
  contractAddress: string;
  /** @inheritdoc */
  encodedABI: string;

  /**
   * Constructs a new instance of the UnstakeResponseBody class.
   * @param params - The {@link IUnstakeResponseBody} parameters for the response body.
   */
  constructor({ contractAddress, encodedABI }: IUnstakeResponseBody) {
    this.contractAddress = contractAddress;
    this.encodedABI = encodedABI;
  }

  /**
   * Creates a new UnstakeResponseBody instance from a JSON object.
   * @param json - The JSON object representing the UnstakeResponseBody.
   * @returns A new UnstakeResponseBody instance.
   */
  static fromJson(json: any): UnstakeResponseBody {
    return new UnstakeResponseBody(json);
  }

  /**
   * Converts the UnstakeResponseBody instance to a JSON object.
   * @returns The JSON object representing the UnstakeResponseBody.
   */
  toJson(): object {
    return {
      contractAddress: this.contractAddress,
      encodedABI: this.encodedABI,
    };
  }
}
