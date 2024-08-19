/**
 * Interface representing a staked token's essential details.
 */
export interface IStakedToken {
  /** The blockchain address of the staked token. */
  tokenAddress: string
  /** The symbol of the staked token. */
  tokenSymbol: string
  /** The name of the staked token. */
  tokenName: string
  /** The URI for the logo of the staked token. */
  tokenLogoURI: string
  /** The amount of tokens staked. */
  stakedAmount: number
  /** The staked amount in USD. */
  stakedAmountUSD: number
  /** The earned amount in USD from staking. */
  earnedAmountUSD: number
  /** The address of the token received upon unstaking. */
  unStakeTokenAddress: string
  /** The annual percentage rate (APR) for staking. */
  stakingApr: number
}

/**
 * Class representing a staked token with methods for instantiation from JSON.
 */
export class StakedToken implements IStakedToken {
  tokenAddress: string
  tokenSymbol: string
  tokenName: string
  tokenLogoURI: string
  stakedAmount: number
  unStakeTokenAddress: string
  stakedAmountUSD: number
  earnedAmountUSD: number
  stakingApr: number

  /**
   * Constructs a new StakedToken instance.
   * @param params - Object containing initialization values.
   */
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
    this.tokenAddress = tokenAddress
    this.tokenSymbol = tokenSymbol
    this.tokenName = tokenName
    this.tokenLogoURI = tokenLogoURI
    this.stakedAmount = stakedAmount
    this.unStakeTokenAddress = unStakeTokenAddress
    this.stakedAmountUSD = stakedAmountUSD
    this.earnedAmountUSD = earnedAmountUSD
    this.stakingApr = stakingApr
  }

  /**
   * Creates a StakedToken instance from a JSON object.
   * @param json - JSON object containing staked token details.
   * @returns A new StakedToken instance.
   */
  static fromJson(json: any): StakedToken {
    return new StakedToken(json)
  }
}

/**
 * Interface representing the response structure for staked tokens data.
 */
export interface IStakedTokenResponse {
  /** The total staked amount in USD. */
  totalStakedAmountUSD: number
  /** The total earned amount in USD. */
  totalEarnedAmountUSD: number
  /** Array of StakedToken instances. */
  stakedTokens: StakedToken[]
}

/**
 * Class representing a response containing multiple staked tokens.
 */
export class StakedTokenResponse implements IStakedTokenResponse {
  totalStakedAmountUSD: number
  totalEarnedAmountUSD: number
  stakedTokens: StakedToken[]

  /**
   * Constructs a new StakedTokenResponse instance.
   * @param params - Object containing initialization values for the response.
   */
  constructor({ totalStakedAmountUSD, totalEarnedAmountUSD, stakedTokens }: IStakedTokenResponse) {
    this.totalStakedAmountUSD = totalStakedAmountUSD
    this.totalEarnedAmountUSD = totalEarnedAmountUSD
    this.stakedTokens = stakedTokens.map(StakedToken.fromJson)
  }

  /**
   * Creates a StakedTokenResponse instance from a JSON object.
   * @param json - JSON object containing staked tokens response details.
   * @returns A new StakedTokenResponse instance.
   */
  static fromJson(json: any): StakedTokenResponse {
    return new StakedTokenResponse({
      totalStakedAmountUSD: json.totalStakedAmountUSD,
      totalEarnedAmountUSD: json.totalEarnedAmountUSD,
      stakedTokens: json.stakedTokens.map((tokenJson: any) => StakedToken.fromJson(tokenJson)),
    })
  }
}
