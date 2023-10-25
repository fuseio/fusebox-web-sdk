export interface IStakedToken {
  tokenAddress: string;
  tokenSymbol: string;
  tokenName: string;
  tokenLogoUri: string;
  stakedAmount: number;
  stakedAmountUSD: number;
  earnedAmountUSD: number;
  unstakeTokenAddress: string;
  stakingApr: number;
}

export interface IStakedTokenResponse {
  stakedTokens: IStakedToken[];
  totalStakedAmountUSD: number;
  totalEarnedAmountUSD: number;
}
