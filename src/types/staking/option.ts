
export interface IStakingOption {
  tokenAddress: string;
  tokenSymbol: string;
  tokenName: string;
  tokenLogoURI: string;
  expired: boolean;
  unStakeTokenAddress: string;
  stakingApr: number;
  tvl: number;
}

export class StakingOption implements IStakingOption {
  tokenAddress: string;
  tokenSymbol: string;
  tokenName: string;
  tokenLogoURI: string;
  expired: boolean;
  unStakeTokenAddress: string;
  stakingApr: number;
  tvl: number;

  constructor({
    tokenAddress,
    tokenSymbol,
    tokenName,
    tokenLogoURI,
    expired,
    unStakeTokenAddress,
    stakingApr,
    tvl,
  }: IStakingOption) {
    this.tokenAddress = tokenAddress;
    this.tokenSymbol = tokenSymbol;
    this.tokenName = tokenName;
    this.tokenLogoURI = tokenLogoURI;
    this.expired = expired;
    this.unStakeTokenAddress = unStakeTokenAddress;
    this.stakingApr = stakingApr;
    this.tvl = tvl;
  }

  static fromJson(json: any): StakingOption {
    return new StakingOption({
      tokenAddress: json.tokenAddress,
      tokenSymbol: json.tokenSymbol,
      tokenName: json.tokenName,
      tokenLogoURI: json.tokenLogoURI,
      expired: json.expired,
      unStakeTokenAddress: json.unStakeTokenAddress,
      stakingApr: json.stakingApr,
      tvl: json.tvl,
    });
  }

  static optionsFromJson(docs: any[]): StakingOption[] {
    return docs.map(doc => StakingOption.fromJson(doc));
  }
}
