import { AxiosInstance } from 'axios';
import { IStakingOptions } from '../types/staking/option';
import { IStakeRequestBody, IStakeResponseBody } from '../types/staking/stake';
import { IUnstakeRequestBody } from '../types/staking/unstake';
import { IStakedTokenResponse } from '../types/staking/staked_token';

export class StakingModule {
  private readonly _axios: AxiosInstance;

  constructor(axios: AxiosInstance) {
    this._axios = axios;
  }

  public async getStakingOptions() {
    try {
      const response = await this._axios.get('/v0/staking/staking_options');
      if (response.status == 200) {
        return response.data as IStakingOptions;
      }
      return new Error('Error getting staking options');
    } catch (e: any) {
      return new Error(e);
    }
  }

  public async stake(stakeRequestBody: IStakeRequestBody) {
    try {
      const response = await this._axios.post('/v0/staking/stake', stakeRequestBody);
      if (response.status == 201) {
        return response.data as IStakeResponseBody;
      }
      return new Error('Failed to fetch encoded data for stake interaction');
    } catch (e: any) {
      return new Error(e);
    }
  }

  public async unstake(unstakeRequestBody: IUnstakeRequestBody) {
    try {
      const response = await this._axios.post('/v0/staking/unstake', unstakeRequestBody);
      if (response.status == 201) {
        return response.data as IStakeResponseBody;
      }
      return new Error('Failed to fetch encoded data for unstake interaction');
    } catch (e: any) {
      return new Error(e);
    }
  }

  public async getStakedTokens(walletAddress: string) {
    try {
      const response = await this._axios.get(`/v0/staking/staked_tokens/${walletAddress}`);
      if (response.status == 200) {
        return response.data as IStakedTokenResponse;
      }
      return new Error('Failed to fetch staked tokens');
    } catch (e: any) {
      return new Error(e);
    }
  }
}
