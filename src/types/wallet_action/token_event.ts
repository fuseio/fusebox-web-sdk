import { nameFromJson, addressFromJson, amountFromJson } from "../token/token_details";

/**
 * Represents different types of token events, such as native token events,
 * ERC-20 token transfers, and ERC-721 token transfers.
 */
export abstract class TokenEvent {
  symbol: string;
  name: string;
  address: string;
  value: BigInt;
  to?: string;
  from?: string;

  protected constructor(data: {
    symbol: string;
    name: string;
    address: string;
    value: BigInt;
    to?: string;
    from?: string;
  }) {
    this.symbol = data.symbol;
    this.name = data.name;
    this.address = data.address;
    this.value = data.value;
    this.to = data.to;
    this.from = data.from;
  }

  /**
   * Factory method to create an instance of TokenEvent from a JSON object.
   * @param json The JSON object to parse.
   * @returns An instance of one of the TokenEvent subclasses based on the type.
   */
  static fromJson(json: any): TokenEvent {
    switch (json.type) {
      case 'native':
        return new NativeToken(json);
      case 'ERC-20':
        return new ERC20Transfer(json);
      case 'ERC-721':
        return new ERC721Transfer(json);
      default:
        throw new Error('Unsupported token event type');
    }
  }
}

export class NativeToken extends TokenEvent {
  decimals: number;

  constructor(data: any) {
    super(data);
    this.decimals = data.decimals ?? 18;
  }
}

export class ERC20Transfer extends TokenEvent {
  decimals: number;

  constructor(data: any) {
    super(data);
    this.decimals = data.decimals;
    this.symbol = data.symbol;
    this.name = nameFromJson(data.name);
    this.address = addressFromJson(data.address);
    this.value = amountFromJson(data.value);
  }
}

export class ERC721Transfer extends TokenEvent {
  tokenId?: BigInt;

  constructor(data: any) {
    super(data);
    this.tokenId = data.tokenId;
    this.symbol = data.symbol;
    this.name = nameFromJson(data.name);
    this.address = addressFromJson(data.address);
    this.value = amountFromJson(data.value);
  }
}
