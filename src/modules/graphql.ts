import type { AxiosInstance } from 'axios'
import { Account } from '../types'
import { UserOp } from '../types/user_op/user_op'

export class GraphQLModule {
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
    }

    return Account.fromJson(result.data.data.account)
  }

  /**
   * Retrieves a list of user operations by sender.
   *
   * @param sender - The sender of the user operations to retrieve.
   * @returns A list of user operations.
   * @throws If there is an error retrieving the collectibles or if the response status is not 200.
   */
  async getUserOpsBySender(sender: string): Promise<UserOp[]> {
    const result = await this._axios.get(`/v0/graphql/userops/${sender}`)
    if (!result.data?.data?.userOps) {
      return []
    }

    return UserOp.opsFromJson(result.data.data.userOps)
  }
}
