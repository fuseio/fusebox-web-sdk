/**
 * Interface representing a token with basic properties.
 */
export interface IToken {
  address: string;
  name: string;
  symbol: string;
}

/**
 * Extracts the token name, removing the 'on Fuse' suffix if present.
 * @param tokenName The original name of the token.
 * @returns The processed token name.
 */
export function nameFromJson(tokenName: string): string {
  return tokenName.endsWith('on Fuse') ? tokenName.replace(' on Fuse', '') : tokenName;
}

/**
 * Converts a string value to a bigint, handling null by returning 0.
 * @param value The string value to convert.
 * @returns The bigint representation.
 */
export function amountFromJson(value: string | null): bigint {
  return value ? BigInt(value) : BigInt(0);
}

/**
 * Converts a token address to lowercase.
 * @param address The original token address.
 * @returns The lowercase token address.
 */
export function addressFromJson(address: string): string {
  return address.toLowerCase();
}

/**
 * Converts a decimal string to a number, defaulting to 0 if null.
 * @param decimals The decimal string to convert.
 * @returns The numeric representation of decimals.
 */
export function decimalsFromJson(decimals: string | null): number {
  return decimals ? parseInt(decimals, 10) : 0;
}

/**
 * Represents the native token with predefined values and custom amount.
 */
export class Native implements IToken {
  symbol: string = 'FUSE';
  name: string = 'Fuse Token';
  address: string = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
  decimals: number = 18;
  amount: bigint;

  /**
   * Constructs a Native token instance.
   * @param json The JSON object containing the amount.
   */
  constructor(json: any) {
    this.amount = amountFromJson(json.amount);
  }
}

/**
 * Represents liquidity pool tokens with dynamic properties.
 */
export class LpTokens implements IToken {
  symbol: string;
  name: string;
  address: string;

  /**
   * Constructs an LpTokens instance.
   * @param symbol The token symbol.
   * @param name The token name.
   * @param address The token address.
   */
  constructor({ symbol, name, address }: IToken) {
    this.symbol = symbol;
    this.name = nameFromJson(name);
    this.address = addressFromJson(address);
  }

  /**
   * Creates an LpTokens instance from a JSON object.
   * @param json The JSON object with token properties.
   * @returns An LpTokens instance.
   */
  static fromJson(json: any): LpTokens {
    return new LpTokens({
      symbol: json.symbol,
      name: json.name,
      address: json.address,
    });
  }

  /**
   * Converts the instance to a JSON object.
   * @returns The JSON representation of the instance.
   */
  toJson(): object {
    return {
      symbol: this.symbol,
      name: this.name,
      address: this.address,
    };
  }
}

/**
 * Represents a token within a liquidity pool.
 */
export class LiquidityPoolToken implements IToken {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  underlyingTokens: LpTokens[];

  /**
   * Constructs a LiquidityPoolToken instance.
   * @param json The JSON object containing token and underlying tokens information.
   */
  constructor(json: any) {
    this.symbol = json.symbol;
    this.name = nameFromJson(json.name);
    this.address = addressFromJson(json.address);
    this.decimals = json.decimals;
    this.underlyingTokens = json.underlyingTokens.map((ut: any) => LpTokens.fromJson(ut));
  }
}

/**
 * Represents a bridged token with additional logo URI.
 */
export class BridgedToken implements IToken {
  symbol: string;
  name: string;
  address: string;
  logoURI: string;
  decimals: number;

  /**
   * Constructs a BridgedToken instance.
   * @param json The JSON object containing the token properties.
   */
  constructor(json: any) {
    this.symbol = json.symbol;
    this.name = nameFromJson(json.name);
    this.address = addressFromJson(json.address);
    this.logoURI = json.logoURI;
    this.decimals = decimalsFromJson(json.decimals);
  }
}

/**
 * Represents an ERC20 token with an amount property.
 */
export class ERC20 implements IToken {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  amount: bigint;

  /**
   * Constructs an ERC20 token instance.
   * @param json The JSON object containing the token properties.
   */
  constructor(json: any) {
    this.symbol = json.symbol;
    this.name = nameFromJson(json.name);
    this.address = addressFromJson(json.contractAddress || json.address);
    this.decimals = decimalsFromJson(json.decimals);
    this.amount = amountFromJson(json.balance);
  }
}

/**
 * Represents a miscellaneous token with a logo URI.
 */
export class MiscToken implements IToken {
  symbol: string;
  name: string;
  address: string;
  logoURI: string;
  decimals: number;

  /**
   * Constructs a MiscToken instance.
   * @param json The JSON object containing the token properties.
   */
  constructor(json: any) {
    this.symbol = json.symbol;
    this.name = nameFromJson(json.name);
    this.address = addressFromJson(json.address);
    this.logoURI = json.logoURI;
    this.decimals = decimalsFromJson(json.decimals);
  }
}

/**
 * Represents an ERC721 token, typically without decimals.
 */
export class ERC721 implements IToken {
  symbol: string;
  name: string;
  address: string;
  decimals: number = 0; // ERC721 tokens typically don't have decimals
  amount: bigint;

  /**
   * Constructs an ERC721 token instance.
   * @param json The JSON object containing the token properties.
   */
  constructor(json: any) {
    this.symbol = json.symbol;
    this.name = nameFromJson(json.name);
    this.address = addressFromJson(json.contractAddress || json.address);
    this.amount = amountFromJson(json.balance);
  }
}

/**
 * Parses token details from a JSON object and returns the appropriate token instance.
 * @param json The JSON object containing token details.
 * @returns An instance of a token class based on the type specified in the JSON object.
 * @throws Error if the token type is unknown.
 */
export function parseTokenDetails(json: any): IToken {
  switch (json.type) {
    case 'native':
      return new Native(json);
    case 'lp':
      const underlyingTokens = json.underlyingTokens.map(LpTokens.fromJson);
      return new LiquidityPoolToken({ ...json, underlyingTokens });
    case 'bridged':
      return new BridgedToken(json);
    case 'misc':
      return new MiscToken(json);
    case 'ERC-20':
      return new ERC20(json);
    case 'ERC-721':
      return new ERC721(json);
    default:
      throw new Error('Unknown token type');
  }
}
