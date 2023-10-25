export interface IStakeRequestBody {
  accountAddress: string;
  tokenAmount: string;
  tokenAddress: string;
}

export interface IStakeResponseBody {
  contractAddress: string;
  encodedABI: string;
}
