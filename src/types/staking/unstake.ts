export interface IUnstakeRequestBody {
  accountAddress: string;
  tokenAmount: string;
  tokenAddress: string;
}

export interface IUnstakeResponseBody {
  contractAddress: string;
  encodedABI: string;
}
