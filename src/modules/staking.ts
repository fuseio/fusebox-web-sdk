import { AxiosInstance, AxiosResponse } from 'axios';
import { StakeRequestBody, StakeResponseBody, StakedTokenResponse, StakingOption, UnstakeRequestBody, UnstakeResponseBody } from '../types';

/**
 * Represents a module for staking operations.
 */
export class StakingModule {
  private readonly _axios: AxiosInstance;

  /**
   * Creates an instance of StakingModule.
   * @param axios - The AxiosInstance used for making HTTP requests.
   */
  constructor(axios: AxiosInstance) {
    this._axios = axios;
  }

  /**
   * Retrieves the available staking options.
   * @returns A Promise that resolves to an array of StakingOption objects.
   * @throws If an error occurs during the API request.
   */
  async getStakingOptions(): Promise<StakingOption[]> {
    try {
      const response: AxiosResponse = await this._axios.get('/v0/staking/staking_options');
      if (response.status === 200) {
        return StakingOption.optionsFromJson(response.data);
      }
      throw response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * A function that returns encoded data for the staking contract call.
   * @param stakeRequestBody - The request body for staking.
   * @returns A Promise that resolves to a StakeResponseBody object.
   * @throws If an error occurs during the API request.
   */
  async stake(stakeRequestBody: StakeRequestBody): Promise<StakeResponseBody> {
    try {
      const response: AxiosResponse = await this._axios.post('/v0/staking/stake', stakeRequestBody.toJson());
      if (response.status === 201) {
        return StakeResponseBody.fromJson(response.data);
      }
      throw response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * A function that returns encoded data for unstake contract call.
   * @param unstakeRequestBody - The request body for unstaking.
   * @returns A Promise that resolves to an UnstakeResponseBody object.
   * @throws If an error occurs during the API request.
   */
  async unstake(unstakeRequestBody: UnstakeRequestBody): Promise<UnstakeResponseBody> {
    try {
      const response: AxiosResponse = await this._axios.post('/v0/staking/unstake', unstakeRequestBody.toJson());
      if (response.status === 201) {
        return UnstakeResponseBody.fromJson(response.data);
      }
      throw response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves the staked tokens of a given smart wallet address on the platform.
   * @param walletAddress - The wallet address to retrieve staked tokens for.
   * @returns A Promise that resolves to a StakedTokenResponse object.
   * @throws If an error occurs during the API request.
   */
  async getStakedTokens(walletAddress: string): Promise<StakedTokenResponse> {
    try {
      const response: AxiosResponse = await this._axios.get(`/v0/staking/staked_tokens/${walletAddress}`);
      if (response.status === 200) {
        return StakedTokenResponse.fromJson(response.data);
      }
      throw response;
    } catch (error) {
      throw error;
    }
  }
}
