/**
 * Represents a staked token with details and functionality for staking operations.
 */
export interface IStakingOption {
  /** The address of the staking token. */
  tokenAddress: string;
  /** The symbol of the staking token, e.g., Fuse. */
  tokenSymbol: string;
  /** The name of the staking token, e.g., Fuse Token. */
  tokenName: string;
  /** The URI for the logo of the staking token. */
  tokenLogoURI: string;
  /** Indicates whether the staking option has expired. */
  expired: boolean;
  /** The address of the token received upon unstaking. */
  unStakeTokenAddress: string;
  /** The annual percentage rate (APR) for staking. */
  stakingApr: number;
  /** The total value locked in the staking contract. */
  tvl: number;
}

/**
 * A class implementing `IStakingOption` to manage staking operations.
 */
export class StakingOption implements IStakingOption {
  tokenAddress: string;
  tokenSymbol: string;
  tokenName: string;
  tokenLogoURI: string;
  expired: boolean;
  unStakeTokenAddress: string;
  stakingApr: number;
  tvl: number;

  /**
   * Constructs a new `StakingOption` instance.
   * @param tokenAddress The address of the staking token.
   * @param tokenSymbol The symbol of the staking token.
   * @param tokenName The name of the staking token.
   * @param tokenLogoURI The URI for the logo of the staking token.
   * @param expired Indicates whether the staking option has expired.
   * @param unStakeTokenAddress The address of the token received upon unstaking.
   * @param stakingApr The annual percentage rate (APR) for staking.
   * @param tvl The total value locked in the staking contract.
   */
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

  /**
   * Creates a `StakingOption` instance from a JSON object.
   * @param json A JSON object containing staking option data.
   * @returns A new `StakingOption` instance.
   */
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

  /**
   * Creates an array of `StakingOption` instances from an array of JSON objects.
   * @param docs An array of JSON objects each containing staking option data.
   * @returns An array of `StakingOption` instances.
   */
  static optionsFromJson(docs: any[]): StakingOption[] {
    return docs.map(doc => StakingOption.fromJson(doc));
  }
}
