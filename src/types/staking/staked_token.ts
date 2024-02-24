export interface IStakedToken {
  tokenAddress: string;
  tokenSymbol: string;
  tokenName: string;
  tokenLogoURI: string;
  stakedAmount: number;
  stakedAmountUSD: number;
  earnedAmountUSD: number;
  unStakeTokenAddress: string;
  stakingApr: number;
}

export class StakedToken implements IStakedToken {
  tokenAddress: string;
  tokenSymbol: string;
  tokenName: string;
  tokenLogoURI: string;
  stakedAmount: number;
  unStakeTokenAddress: string;
  stakedAmountUSD: number;
  earnedAmountUSD: number;
  stakingApr: number;

  constructor({
    tokenAddress,
    tokenSymbol,
    tokenName,
    tokenLogoURI,
    stakedAmount,
    unStakeTokenAddress,
    stakedAmountUSD,
    earnedAmountUSD,
    stakingApr,
  }: IStakedToken) {
    this.tokenAddress = tokenAddress;
    this.tokenSymbol = tokenSymbol;
    this.tokenName = tokenName;
    this.tokenLogoURI = tokenLogoURI;
    this.stakedAmount = stakedAmount;
    this.unStakeTokenAddress = unStakeTokenAddress;
    this.stakedAmountUSD = stakedAmountUSD;
    this.earnedAmountUSD = earnedAmountUSD;
    this.stakingApr = stakingApr;
  }

  static fromJson(json: any): StakedToken {
    return new StakedToken(json);
  }
}

export interface IStakedTokenResponse {
  totalStakedAmountUSD: number;
  totalEarnedAmountUSD: number;
  stakedTokens: StakedToken[];
}

export class StakedTokenResponse implements IStakedTokenResponse {
  totalStakedAmountUSD: number;
  totalEarnedAmountUSD: number;
  stakedTokens: StakedToken[];

  constructor({ totalStakedAmountUSD, totalEarnedAmountUSD, stakedTokens }: IStakedTokenResponse) {
    this.totalStakedAmountUSD = totalStakedAmountUSD;
    this.totalEarnedAmountUSD = totalEarnedAmountUSD;
    this.stakedTokens = stakedTokens.map(StakedToken.fromJson);
  }

  static fromJson(json: any): StakedTokenResponse {
    return new StakedTokenResponse({
      totalStakedAmountUSD: json.totalStakedAmountUSD,
      totalEarnedAmountUSD: json.totalEarnedAmountUSD,
      stakedTokens: json.stakedTokens.map((tokenJson: any) => StakedToken.fromJson(tokenJson)),
    });
  }
}
