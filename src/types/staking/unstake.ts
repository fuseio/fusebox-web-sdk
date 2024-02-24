export interface IUnstakeRequestBody {
  accountAddress: string;
  tokenAmount: string;
  tokenAddress: string;
}

export class UnstakeRequestBody implements IUnstakeRequestBody {
  accountAddress: string;
  tokenAmount: string;
  tokenAddress: string;

  constructor({ accountAddress, tokenAmount, tokenAddress }: IUnstakeRequestBody) {
    this.accountAddress = accountAddress;
    this.tokenAmount = tokenAmount;
    this.tokenAddress = tokenAddress;
  }

  static fromJson(json: any): UnstakeRequestBody {
    return new UnstakeRequestBody(json);
  }

  toJson(): object {
    return {
      accountAddress: this.accountAddress,
      tokenAmount: this.tokenAmount,
      tokenAddress: this.tokenAddress,
    };
  }
}

export interface IUnstakeResponseBody {
  contractAddress: string;
  encodedABI: string;
}

export class UnstakeResponseBody implements IUnstakeResponseBody {
  contractAddress: string;
  encodedABI: string;

  constructor({ contractAddress, encodedABI }: IUnstakeResponseBody) {
    this.contractAddress = contractAddress;
    this.encodedABI = encodedABI;
  }

  static fromJson(json: any): UnstakeResponseBody {
    return new UnstakeResponseBody(json);
  }

  toJson(): object {
    return {
      contractAddress: this.contractAddress,
      encodedABI: this.encodedABI,
    };
  }
}
