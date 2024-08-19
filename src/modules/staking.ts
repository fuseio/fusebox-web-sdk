import type { AxiosInstance, AxiosResponse } from 'axios'
import {
  type StakeRequestBody,
  StakeResponseBody,
  StakedTokenResponse,
  StakingOption,
  type UnstakeRequestBody,
  UnstakeResponseBody,
} from '../types'

/**
 * Represents a module for staking operations.
 */
export class StakingModule {
  private readonly _axios: AxiosInstance

  /**
   * Creates an instance of StakingModule.
   * @param axios - The AxiosInstance used for making HTTP requests.
   */
  constructor(axios: AxiosInstance) {
    this._axios = axios
  }

  /**
   * Retrieves the available staking options.
   * @returns A Promise that resolves to an array of StakingOption objects.
   * @throws If an error occurs during the API request.
   */
  async getStakingOptions(): Promise<StakingOption[]> {
    const response: AxiosResponse = await this._axios.get('/v0/staking/staking_options')
    return StakingOption.optionsFromJson(response.data)
  }

  /**
   * A function that returns encoded data for the staking contract call.
   * @param stakeRequestBody - The request body for staking.
   * @returns A Promise that resolves to a StakeResponseBody object.
   * @throws If an error occurs during the API request.
   */
  async stake(stakeRequestBody: StakeRequestBody): Promise<StakeResponseBody> {
    const response: AxiosResponse = await this._axios.post(
      '/v0/staking/stake',
      stakeRequestBody.toJson()
    )
    return StakeResponseBody.fromJson(response.data)
  }

  /**
   * A function that returns encoded data for unstake contract call.
   * @param unstakeRequestBody - The request body for unstaking.
   * @returns A Promise that resolves to an UnstakeResponseBody object.
   * @throws If an error occurs during the API request.
   */
  async unstake(unstakeRequestBody: UnstakeRequestBody): Promise<UnstakeResponseBody> {
    const response: AxiosResponse = await this._axios.post(
      '/v0/staking/unstake',
      unstakeRequestBody.toJson()
    )
    return UnstakeResponseBody.fromJson(response.data)
  }

  /**
   * Retrieves the staked tokens of a given smart wallet address on the platform.
   * @param walletAddress - The wallet address to retrieve staked tokens for.
   * @returns A Promise that resolves to a StakedTokenResponse object.
   * @throws If an error occurs during the API request.
   */
  async getStakedTokens(walletAddress: string): Promise<StakedTokenResponse> {
    const response: AxiosResponse = await this._axios.get(
      `/v0/staking/staked_tokens/${walletAddress}`
    )
    return StakedTokenResponse.fromJson(response.data)
  }
}
