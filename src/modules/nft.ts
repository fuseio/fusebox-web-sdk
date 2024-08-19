import type { AxiosInstance } from 'axios'
import { Account } from '../types'

/**
 * @deprecated Use GraphQLModule instead.
 */
export class NftModule {
  private readonly _axios: AxiosInstance

  constructor(axiosInstance: AxiosInstance) {
    this._axios = axiosInstance
  }

  /**
   * Retrieves the collectibles owned by a specific wallet address.
   *
   * @param walletAddress - The wallet address of the owner.
   * @returns A Promise that resolves to an Account object representing the owner's account.
   * @throws If there is an error retrieving the collectibles or if the response status is not 200.
   */
  async getCollectiblesByOwner(walletAddress: string): Promise<Account> {
    const result = await this._axios.get(`/v0/graphql/collectibles/${walletAddress}`)
    if (!result.data?.data?.account) {
      return new Account({
        id: walletAddress,
        address: walletAddress,
        collectibles: [],
      })
    } else {
      return Account.fromJson(result.data.data.account)
    }
  }
}
