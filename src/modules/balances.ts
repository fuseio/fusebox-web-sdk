import { AxiosInstance } from 'axios';
import { Variables } from '../constants/variables';
import { Account, IToken, Native, parseTokenDetails } from '../types';

/**
 * A class that provides methods for interacting with the Fuse blockchain explorer.
 */
export class BalancesModule {
  private readonly _axios: AxiosInstance;

  /**
   * Creates an instance of the [BalancesModule] class.
   * @param axiosInstance - The AxiosInstance used for making HTTP requests.
   */
  constructor(axiosInstance: AxiosInstance) {
    this._axios = axiosInstance
  }

  /**
   * Gets the list of tokens associated with a wallet address.
   * @param walletAddress - The wallet address.
   * @returns A Promise that resolves to an array of IToken objects.
   */
  async getTokenList(walletAddress: string): Promise<IToken[]> {
    try {
      const response = await this._axios.get(
        `/v0/balances/assets/${walletAddress}`,
      );
      return response.data.result.map((item: IToken) => {
        return parseTokenDetails(item);
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves the Non Fungible NFT Token Balances owned by a specified address.
   * 
   * @param walletAddress - The wallet address of the owner.
   * @returns A Promise that resolves to an Account object representing the owner's account.
   * @throws If there is an error retrieving the collectibles or if the response status is not 200.
   */
  async getNFTs(walletAddress: string): Promise<Account> {
    try {
      const result = await this._axios.get(`/v0/balances/nft-assets/${walletAddress}`);
      if (result.status === 200) {
        if (!result.data?.data?.account) {
          return new Account({ id: walletAddress, address: walletAddress, collectibles: [] });
        } else {
          return Account.fromJson(result.data.data.account);
        }
      }
      throw result;
    } catch (error) {
      throw error;
    }
  }
}
