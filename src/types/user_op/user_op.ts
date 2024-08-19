import { amountFromJson } from '../token'

/**
 * Represents a user operation.
 */
export class UserOp {
  /**
   * Creates a new instance of the UserOp class.
   * @param transactionHash The transaction hash.
   * @param userOpHash The user operation hash.
   * @param sender The sender address.
   * @param entryPoint The entry point.
   * @param paymaster The paymaster address.
   * @param paymasterAndData The paymaster and data.
   * @param nonce The nonce.
   * @param success Indicates if the operation was successful.
   * @param revertReason The revert reason, if any.
   * @param blockTime The block time.
   * @param blockNumber The block number.
   * @param target The target address.
   * @param beneficiary The beneficiary address.
   * @param erc20Transfers The ERC20 transfers.
   * @param erc721Transfers The ERC721 transfers.
   */
  constructor(
    public transactionHash: string,
    public userOpHash: string,
    public sender: string,
    public entryPoint: string,
    public paymaster: string,
    public paymasterAndData: string,
    public nonce: string,
    public success: boolean,
    public revertReason: string | null,
    public blockTime: string,
    public blockNumber: string,
    public target: string,
    public beneficiary: string,
    public erc20Transfers: Erc20Transfers[] = [],
    public erc721Transfers: Erc721Transfers[] = []
  ) {}

  /**
   * Creates a new instance of the UserOp class from a JSON object.
   * @param json The JSON object.
   * @returns A new instance of the UserOp class.
   */
  static fromJson(json: any): UserOp {
    return new UserOp(
      json.transactionHash,
      json.userOpHash,
      json.sender,
      json.entryPoint,
      json.paymaster,
      json.paymasterAndData,
      json.nonce,
      json.success,
      json.revertReason ?? null,
      json.blockTime,
      json.blockNumber,
      json.target,
      json.beneficiary,
      json.erc20Transfers?.map(Erc20Transfers.fromJson) ?? [],
      json.erc721Transfers?.map(Erc721Transfers.fromJson) ?? []
    )
  }

  /**
   * Creates an array of UserOp instances from an array of JSON objects.
   * @param docs The array of JSON objects.
   * @returns An array of UserOp instances.
   */
  static opsFromJson(docs: any[]): UserOp[] {
    return docs.map((doc) => UserOp.fromJson(doc))
  }
}

/**
 * Represents an ERC20 transfer.
 */
export class Erc20Transfers {
  /**
   * Represents a user operation.
   * @param from - The sender address.
   * @param to - The recipient address.
   * @param value - The value of the operation.
   * @param contractAddress - The address of the contract.
   * @param name - The name of the operation.
   * @param symbol - The symbol of the operation.
   * @param decimals - The number of decimal places for the operation.
   */
  constructor(
    public from: string,
    public to: string,
    public value: bigint,
    public contractAddress: string,
    public name: string,
    public symbol: string,
    public decimals: number
  ) {}

  /**
   * Creates an instance of Erc20Transfers from a JSON object.
   * @param json The JSON object representing the ERC20 transfer.
   * @returns An instance of Erc20Transfers.
   */
  static fromJson(json: any): Erc20Transfers {
    return new Erc20Transfers(
      json.from,
      json.to,
      amountFromJson(json.value),
      json.contractAddress,
      json.name,
      json.symbol,
      json.decimals
    )
  }
}

/**
 * Represents a transfer of an ERC721 token.
 */
export class Erc721Transfers {
  /**
   * Creates a new instance of the Erc721Transfers class.
   * @param from The address of the sender.
   * @param to The address of the recipient.
   * @param contractAddress The address of the ERC721 contract.
   * @param tokenId The ID of the token being transferred.
   * @param name The name of the ERC721 contract.
   * @param symbol The symbol of the ERC721 contract.
   */
  constructor(
    public from: string,
    public to: string,
    public contractAddress: string,
    public tokenId: string,
    public name: string,
    public symbol: string
  ) {}

  /**
   * Creates a new instance of the Erc721Transfers class from a JSON object.
   * @param json The JSON object representing the Erc721Transfers.
   * @returns A new instance of the Erc721Transfers class.
   */
  static fromJson(json: any): Erc721Transfers {
    return new Erc721Transfers(
      json.from,
      json.to,
      json.contractAddress,
      json.tokenId,
      json.name,
      json.symbol
    )
  }
}
