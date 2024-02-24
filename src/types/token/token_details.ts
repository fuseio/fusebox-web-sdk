export interface IToken {
  address: string;
  name: string;
  symbol: string;
}

function nameFromJson(tokenName: string): string {
  return tokenName.endsWith('on Fuse') ? tokenName.replace(' on Fuse', '') : tokenName;
}

function amountFromJson(value: string | null): bigint {
  return value ? BigInt(value) : BigInt(0);
}

function addressFromJson(address: string): string {
  return address.toLowerCase();
}

function decimalsFromJson(decimals: string | null): number {
  return decimals ? parseInt(decimals, 10) : 0;
}

export class Native implements IToken {
  symbol: string = 'FUSE';
  name: string = 'Fuse Token';
  address: string = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
  decimals: number = 18;
  amount: bigint;

  constructor(json: any) {
    this.amount = amountFromJson(json.amount);
  }
}

export class LpTokens implements IToken {
  symbol: string;
  name: string;
  address: string;

  constructor({ symbol, name, address }: IToken) {
    this.symbol = symbol;
    this.name = nameFromJson(name);
    this.address = addressFromJson(address);
  }

  static fromJson(json: any): LpTokens {
    return new LpTokens({
      symbol: json.symbol,
      name: json.name,
      address: json.address,
    });
  }

  toJson(): object {
    return {
      symbol: this.symbol,
      name: this.name,
      address: this.address,
    };
  }
}
export class LiquidityPoolToken implements IToken {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  underlyingTokens: LpTokens[];

  constructor(json: any) {
    this.symbol = json.symbol;
    this.name = nameFromJson(json.name);
    this.address = addressFromJson(json.address);
    this.decimals = json.decimals;
    this.underlyingTokens = json.underlyingTokens.map((ut: any) => LpTokens.fromJson(ut));
  }
}

export class BridgedToken implements IToken {
  symbol: string;
  name: string;
  address: string;
  logoURI: string;
  decimals: number;

  constructor(json: any) {
    this.symbol = json.symbol;
    this.name = nameFromJson(json.name);
    this.address = addressFromJson(json.address);
    this.logoURI = json.logoURI;
    this.decimals = decimalsFromJson(json.decimals);
  }
}

export class ERC20 implements IToken {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  amount: bigint;

  constructor(json: any) {
    this.symbol = json.symbol;
    this.name = nameFromJson(json.name);
    this.address = addressFromJson(json.contractAddress || json.address);
    this.decimals = decimalsFromJson(json.decimals);
    this.amount = amountFromJson(json.balance);
  }
}

export class MiscToken implements IToken {
  symbol: string;
  name: string;
  address: string;
  logoURI: string;
  decimals: number;

  constructor(json: any) {
    this.symbol = json.symbol;
    this.name = nameFromJson(json.name);
    this.address = addressFromJson(json.address);
    this.logoURI = json.logoURI;
    this.decimals = decimalsFromJson(json.decimals);
  }
}

export class ERC721 implements IToken {
  symbol: string;
  name: string;
  address: string;
  decimals: number = 0; // ERC721 tokens typically don't have decimals
  amount: bigint;

  constructor(json: any) {
    this.symbol = json.symbol;
    this.name = nameFromJson(json.name);
    this.address = addressFromJson(json.contractAddress || json.address);
    this.amount = amountFromJson(json.balance);
  }
}

export function parseTokenDetails(json: any): IToken {
  console.log('json:', json);
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
