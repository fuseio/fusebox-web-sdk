export interface IStakeRequestBody {
  accountAddress: string;
  tokenAmount: string;
  tokenAddress: string;
}

export class StakeRequestBody implements IStakeRequestBody {
  accountAddress: string;
  tokenAmount: string;
  tokenAddress: string;

  constructor({ accountAddress, tokenAmount, tokenAddress }: IStakeRequestBody) {
    this.accountAddress = accountAddress;
    this.tokenAmount = tokenAmount;
    this.tokenAddress = tokenAddress;
  }

  static fromJson(json: any): StakeRequestBody {
    return new StakeRequestBody({
      accountAddress: json.accountAddress,
      tokenAmount: json.tokenAmount,
      tokenAddress: json.tokenAddress,
    });
  }

  toJson(): object {
    return {
      accountAddress: this.accountAddress,
      tokenAmount: this.tokenAmount,
      tokenAddress: this.tokenAddress,
    };
  }
}

export interface IStakeResponseBody {
  contractAddress: string;
  encodedABI: string;
}

export class StakeResponseBody implements IStakeResponseBody {
  contractAddress: string;
  encodedABI: string;

  constructor({ contractAddress, encodedABI }: IStakeResponseBody) {
    this.contractAddress = contractAddress;
    this.encodedABI = encodedABI;
  }

  static fromJson(json: any): StakeResponseBody {
    return new StakeResponseBody({
      contractAddress: json.contractAddress,
      encodedABI: json.encodedABI,
    });
  }

  toJson(): object {
    return {
      contractAddress: this.contractAddress,
      encodedABI: this.encodedABI,
    };
  }
}
