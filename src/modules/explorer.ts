import type { AxiosInstance } from 'axios'
import Variables from '../constants/variables'
import { type IToken, Native, parseTokenDetails } from '../types'

/**
 * A class that provides methods for interacting with the Fuse blockchain explorer.
 */
export class ExplorerModule {
  private readonly _axios: AxiosInstance

  /**
   * Creates an instance of the [ExplorerModule] class.
   * @param axiosInstance - The AxiosInstance used for making HTTP requests.
   */
  constructor(axiosInstance: AxiosInstance) {
    this._axios = axiosInstance
  }

  /**
   * Gets the native balance of a wallet address.
   * @param walletAddress - The wallet address whose native balance is to be retrieved.
   * @returns A Promise that resolves to the native balance as a bigint.
   */
  async getNativeBalance(walletAddress: string): Promise<bigint> {
    const response = await this._axios.get(
      `/v0/explorer?module=account&action=balance&address=${walletAddress}`
    )
    return BigInt(response.data.result)
  }

  /**
   * Retrieves the contract ABI for a given contract address.
   * @param address - The contract address whose ABI is to be retrieved.
   * @returns A Promise that resolves to the ABI as a string.
   */
  async getABI(address: string): Promise<string> {
    const response = await this._axios.get(
      `/v0/explorer?module=contract&action=getabi&address=${address}`
    )
    return JSON.stringify(JSON.parse(response.data.result))
  }

  /**
   * Gets the list of tokens associated with a wallet address.
   * @param walletAddress - The wallet address.
   * @returns A Promise that resolves to an array of IToken objects.
   */
  async getTokenList(walletAddress: string): Promise<IToken[]> {
    const response = await this._axios.get(
      `/v0/explorer?module=account&action=tokenlist&address=${walletAddress}`
    )
    return response.data.result.map((item: IToken) => {
      return parseTokenDetails(item)
    })
  }

  /**
   * Gets the details of a token.
   * @param contractAddress - The address of the token contract.
   * @returns A Promise that resolves to an IToken object.
   */
  async getTokenDetails(contractAddress: string): Promise<IToken> {
    if (contractAddress.toLowerCase() === Variables.NATIVE_TOKEN_ADDRESS.toLowerCase()) {
      return new Native({ balance: BigInt(0) })
    }
    const response = await this._axios.get(
      `/v0/explorer?module=token&action=getToken&contractaddress=${contractAddress}`
    )
    return parseTokenDetails({ ...response.data.result, balance: '0' })
  }

  /**
   * Gets the balance of a token in a wallet.
   * @param contractAddress - The address of the token contract.
   * @param walletAddress - The wallet address.
   * @returns A Promise that resolves to the token balance as a bigint.
   */
  async getTokenBalance(contractAddress: string, walletAddress: string): Promise<bigint> {
    if (contractAddress.toLowerCase() === Variables.NATIVE_TOKEN_ADDRESS.toLowerCase()) {
      return this.getNativeBalance(walletAddress)
    }
    const response = await this._axios.get(
      `/v0/explorer?module=account&action=tokenbalance&contractaddress=${contractAddress}&address=${walletAddress}`
    )
    return BigInt(response.data.result)
  }
}
