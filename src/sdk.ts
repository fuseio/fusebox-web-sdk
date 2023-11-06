import axios, { AxiosInstance } from 'axios';
import ethers, { BigNumberish } from 'ethers';
import {
  Client,
  ICall,
  IClientOpts,
  IPresetBuilderOpts,
  ISendUserOperationResponse,
  UserOperationMiddlewareFn,
} from 'userop';
import { EtherspotWallet } from './etherspot';
import { verifyingPaymaster } from 'userop/dist/preset/middleware';
import { SmartWalletAuth } from './utils/auth';
import { ContractUtils } from './utils/contracts';
import { rethrowError } from '@etherspot/prime-sdk/dist/sdk/common';
import { Variables } from './constants/variables';
import { ITokenDetails } from './types/token/token_details';

export class FuseSDK {
  private readonly _axios: AxiosInstance;
  private readonly _feeTooLowError = 'fee too low';
  private _jwtToken!: string;
  public wallet!: EtherspotWallet;
  public client!: Client;

  constructor(public readonly publicApiKey: string) {
    this._axios = axios.create({
      baseURL: `https://${Variables.BASE_URL}/api`,
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        apiKey: publicApiKey,
      },
    });
  }

  /**
   * Initializes the SDK.
   * @param publicApiKey is required to authenticate with the Fuse API.
   * @param credentials are the Ethereum private key credentials.
   * @param withPaymaster indicates if the paymaster should be used.
   * @param paymasterContext provides additional context for the paymaster.
   * @param opts are the preset builder options.
   * @param clientOpts are the client options.
   * @returns
   */
  static async init(
    publicApiKey: string,
    credentials: ethers.Signer,
    {
      withPaymaster,
      paymasterContext,
      opts,
      clientOpts,
    }: {
      withPaymaster?: boolean;
      paymasterContext?: Record<string, unknown>;
      opts?: IPresetBuilderOpts;
      clientOpts?: IClientOpts;
    } = {}
  ): Promise<FuseSDK> {
    const fuseSDK = new FuseSDK(publicApiKey);
    let paymasterMiddleware;
    if (withPaymaster) {
      paymasterMiddleware = FuseSDK._getPaymasterMiddleware(publicApiKey, paymasterContext);
    }
    fuseSDK.wallet = await FuseSDK._initializeWallet(
      credentials,
      publicApiKey,
      opts,
      paymasterMiddleware
    );
    await fuseSDK.authenticate(credentials);
    fuseSDK.client = await Client.init(FuseSDK._getBundlerRpc(publicApiKey), {
      ...clientOpts,
    });
    return fuseSDK;
  }

  /**
   * Executes a batch of calls in a single transaction.
   * @param calls are the calls to be executed.
   * @param txOptions are the transaction options.
   * @returns
   */
  async executeBatch(
    calls: Array<ICall>,
    txOptions?: typeof Variables.DEFAULT_TX_OPTIONS
  ): Promise<ISendUserOperationResponse | null | undefined> {
    txOptions = txOptions ?? Variables.DEFAULT_TX_OPTIONS;
    const initialFees = BigInt(txOptions.feePerGas);
    this.setWalletFees(initialFees);

    try {
      const userOp = this.wallet.executeBatch(calls);
      return await this.client.sendUserOperation(userOp);
    } catch (e: any) {
      if (e.message.contains(this._feeTooLowError) && txOptions.withRetry) {
        const increasedFees = this._increaseFeeByPercentage(
          initialFees,
          txOptions.feeIncrementPercentage
        );
        this.setWalletFees(increasedFees);
        try {
          const userOp = this.wallet.executeBatch(calls);
          return await this.client.sendUserOperation(userOp);
        } catch (e: any) {
          rethrowError(e);
        }
      } else {
        rethrowError(e);
      }
    }
  }

  /**
   * Calls a contract with the specified parameters.
   * This method facilitates direct contract interactions.
   * @param to is the address of the contract to call.
   * @param value is the amount of Ether (in Wei) to be sent with the call.
   * @param data is the encoded data of the contract call.
   * @param txOptions are the transaction options.
   * @returns
   */
  async callContract(to: string, value: BigNumberish, data: Uint8Array, txOptions?: typeof Variables.DEFAULT_TX_OPTIONS) {
    const call: ICall = {
      to: to,
      value: value,
      data: data,
    };
    return await this._executeUserOperation(call, txOptions);
  }


  private async _getNativeBalance(address: string): Promise<ethers.BigNumber> {
    const web3client = this.wallet.proxy.provider;
    const balance = await web3client.getBalance(address);
    return balance;
  }

  /**
   * Retrieves the balance of a specified address for a given token.
   *
   * This method fetches the balance of an address. If the token is native, it retrieves
   * the native balance. Otherwise, it fetches the balance of the ERC20 token using the
   * `balanceOf` function of the token's contract.
   *
   * @param tokenAddress Address of the ERC20 token contract.
   * @param address Address of the user.
   * @returns BigInt representing the balance of the address for the specified token.
   */
  async getBalance(tokenAddress: string, address: string) {
    if (this._isNativeToken(tokenAddress)) {
      return await this._getNativeBalance(address);
    }
    return ContractUtils.readFromContractWithFirstResult(
      this.wallet.proxy.provider,
      tokenAddress,
      'ERC20',
      'balanceOf',
      [address]
    );
  }

  /**
   * Retrieves the allowance of tokens that a spender is allowed to withdraw from an owner.
   *
   * This method checks the amount of tokens that an owner has allowed a spender
   * to withdraw from their account using the ERC20 `approve` function.
   *
   * @param tokenAddress Address of the ERC20 token contract.
   * @param spender Address of the spender.
   * @returns BigInt representing the amount of tokens the spender is allowed to withdraw.
   */
  async getAllowance(tokenAddress: string, spender: string) {
    return ContractUtils.readFromContractWithFirstResult(
      this.wallet.proxy.provider,
      tokenAddress,
      'ERC20',
      'allowance',
      [this.wallet.getSender(), spender]
    );
  }

  /**
   * Retrieves detailed information about an ERC20 token.
   *
   * This method fetches the name, symbol, and decimals of an ERC20 token using its address.
   * If the provided tokenAddress matches the native token address, it returns a native token with zero amount.
   *
   * @param tokenAddress Address of the ERC20 token contract.
   * @returns a ITokenDetails object containing the token's name, symbol, decimals, and other relevant details.
   */
  async getERC20TokenDetails(tokenAddress: string) {
    if (this._isNativeToken(tokenAddress)) {
      return {
        symbol: 'ETH',
        name: 'Ether',
        decimals: 18,
        address: tokenAddress,
        amount: BigInt(0),
      };
    }
    const toRead = ['name', 'symbol', 'decimals'];
    const token = await Promise.all(
      toRead.map((key) =>
        ContractUtils.readFromContract(this.wallet.proxy.provider, tokenAddress, 'ERC20', key, [])
      )
    );

    const [name, symbol, decimals] = token;
    return {
      symbol: symbol as string,
      name: name as string,
      decimals: decimals as number,
      address: tokenAddress,
      amount: BigInt(0),
    } as ITokenDetails;
  }

  /**
   * Authenticates the user using the provided private key
   * @param credentials are the Ethereum private key credentials.
   * @returns JWT token upon successful authentication.
   */
  async authenticate(credentials: ethers.Signer): Promise<string> {
    const auth = await SmartWalletAuth.signer(credentials, this.wallet.getSender());
    const response = await this._axios.post('/v2/smart-wallets/auth', auth.toJson());
    this._jwtToken = response.data.jwt;
    return response.data.jwt;
  }

  /**
   * Initializes the wallet with the provided parameters.
   * @param credentials are the Ethereum private key credentials.
   * @param publicApiKey is required to authenticate with the Fuse API.
   * @param opts are the preset builder options.
   * @param paymasterMiddleware is the middleware for the paymaster.
   * @returns
   */
  private static async _initializeWallet(
    credentials: ethers.Signer,
    publicApiKey: string,
    opts?: IPresetBuilderOpts,
    paymasterMiddleware?: UserOperationMiddlewareFn
  ): Promise<EtherspotWallet> {
    return EtherspotWallet.init(credentials, FuseSDK._getBundlerRpc(publicApiKey), {
      entryPoint: opts?.entryPoint,
      factory: opts?.factory,
      salt: opts?.salt,
      paymasterMiddleware: opts?.paymasterMiddleware ?? paymasterMiddleware,
      overrideBundlerRpc: opts?.overrideBundlerRpc,
    });
  }

  /**
   * Retrieves the bundler RPC URL for the provided publicApiKey
   * @param publicApiKey is required to authenticate with the Fuse API.
   * @returns
   */
  private static _getBundlerRpc(publicApiKey: string): string {
    return `https://${Variables.BASE_URL}/api/v0/bundler?apiKey=${publicApiKey}`;
  }

  /**
   * Retrieves the bundler RPC URL for the provided publicApiKey
   * @param publicApiKey is required to authenticate with the Fuse API.
   * @param paymasterContext provides additional context for the paymaster.
   * @returns
   */
  private static _getPaymasterMiddleware(
    publicApiKey: string,
    paymasterContext?: Record<string, unknown>
  ): UserOperationMiddlewareFn {
    return verifyingPaymaster(
      `https://${Variables.BASE_URL}/api/v0/paymaster?apiKey=${publicApiKey}`,
      paymasterContext ?? {}
    );
  }

  /**
   * Checks if the given address is the native token's address.
   * @param tokenAddress is the address to be checked.
   */
  private _isNativeToken(tokenAddress: string): boolean {
    return tokenAddress.toLowerCase() === Variables.NATIVE_TOKEN_ADDRESS.toLowerCase();
  }

  /**
   * Increases the transaction fee by a specified percentage.
   * @param fees are the fees to be set.
   * @param percentage is the percentage by which the fees should be increased.
   */
  private _increaseFeeByPercentage(fee: bigint, percentage: number) {
    return fee + (fee * BigInt(percentage)) / BigInt(100);
  }

  /**
   * Sets the maximum fee per gas and priority fee per gas for the wallet.
   * @param fees are the fees to be set.
   */
  setWalletFees(fees: ethers.BigNumberish) {
    this.wallet.setMaxFeePerGas(fees);
    this.wallet.setMaxPriorityFeePerGas(fees);
  }

  /**
   * Executes a user operation with the provided call.
   * @param call is the call to be executed.
   * @param txOptions are the transaction options.
   * @returns
   */
  private async _executeUserOperation(
    call: ICall,
    txOptions?: typeof Variables.DEFAULT_TX_OPTIONS
  ): Promise<ISendUserOperationResponse | null | undefined> {
    txOptions = txOptions ?? Variables.DEFAULT_TX_OPTIONS;
    const initialFees = BigInt(txOptions.feePerGas);
    this.setWalletFees(initialFees);
    try {
      const userOp = this.wallet.execute(call.to, call.value, call.data);
      return await this.client.sendUserOperation(userOp);
    } catch (e: any) {
      if (e.message.includes(this._feeTooLowError) && txOptions.withRetry) {
        const increasedFees = this._increaseFeeByPercentage(
          initialFees,
          txOptions.feeIncrementPercentage
        );
        this.setWalletFees(increasedFees);
        try {
          const userOp = this.wallet.execute(call.to, call.value, call.data);
          return await this.client.sendUserOperation(userOp);
        } catch (e: any) {
          rethrowError(e);
        }
      } else {
        rethrowError(e);
      }
    }
  }
}
