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
import { TxOptions } from './types/transaction_options/transaction_options';
import { ContractUtils } from './utils/contracts';
import { rethrowError } from '@etherspot/prime-sdk/dist/sdk/common';
import { Variables } from './constants/variables';
import { StakingModule } from './modules/staking';
import { IStakeRequestBody } from './types/staking/stake';
import { ITokenDetails } from './types/token/token_details';
import { hexToBytes } from 'web3-utils';
import { IUnstakeRequestBody } from './types/staking/unstake';

export class FuseSDK {
  private readonly _axios: AxiosInstance;
  private readonly _feeTooLowError = 'fee too low';
  private _jwtToken!: string;
  public wallet!: EtherspotWallet;
  public client!: Client;
  private _stakingModule!: StakingModule;

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
    this._initializeModules();
  }

  public static defaultTxOptions = new TxOptions('1000000', 10, false);

  private _initializeModules(): void {
    this._stakingModule = new StakingModule(this._axios);
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
   * Transfers a specified amount of tokens from the user's address to the recipient.
   * @param tokenAddress Address of the ERC20 token contract.
   * @param recipient Address of the recipient.
   * @param amount Amount of tokens to transfer.
   * @param txOptions are the transaction options.
   * @returns
   */
  async transferToken(
    tokenAddress: string,
    recipient: string,
    amount: BigNumberish,
    txOptions?: TxOptions
  ) {
    let call: ICall;
    if (this._isNativeToken(tokenAddress)) {
      call = {
        to: recipient,
        value: amount,
        data: Uint8Array.from([]),
      };
    } else {
      const callData = ContractUtils.encodeERC20TransferCall(tokenAddress, recipient, amount);
      call = {
        to: tokenAddress,
        value: BigInt(0),
        data: callData,
      };
    }
    return await this._executeUserOperation(call, txOptions);
  }

  /**
   * Transfers an NFT with a given tokenId to the recipient.
   * @param nftContractAddress Address of the ERC721 token contract.
   * @param recipient Address of the recipient.
   * @param tokenId ID of the token to transfer.
   * @param txOptions are the transaction options.
   * @returns
   */
  async transferNFT(
    nftContractAddress: string,
    recipient: string,
    tokenId: BigNumberish,
    txOptions?: TxOptions
  ) {
    const callData = ContractUtils.encodeERC721SafeTransferCall(
      this.wallet.getSender(),
      nftContractAddress,
      recipient,
      tokenId
    );
    const call: ICall = {
      to: nftContractAddress,
      value: BigInt(0),
      data: callData,
    };
    return await this._executeUserOperation(call, txOptions);
  }

  /**
   * Executes a batch of calls in a single transaction.
   * @param calls are the calls to be executed.
   * @param txOptions are the transaction options.
   * @returns
   */
  async executeBatch(
    calls: Array<ICall>,
    txOptions?: TxOptions
  ): Promise<ISendUserOperationResponse | null | undefined> {
    txOptions = txOptions ?? FuseSDK.defaultTxOptions;
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
   * Approves a spender to spend a specified amount of tokens on behalf of the user.
   * @param tokenAddress Address of the ERC20 token contract.
   * @param spender Address of the spender.
   * @param amount Amount of tokens to approve.
   * @param txOptions are the transaction options.
   * @returns
   */
  async approveToken(
    tokenAddress: string,
    spender: string,
    amount: BigNumberish,
    txOptions?: TxOptions
  ) {
    return await this._executeTokenOperation(
      tokenAddress,
      spender,
      amount,
      ContractUtils.encodeERC20ApproveCall,
      txOptions
    );
  }

  /**
   * Approves a spender to spend a specified NFT on behalf of the user.
   * @param nftContractAddress Address of the ERC721 token contract.
   * @param spender Address of the spender.
   * @param tokenId ID of the token to approve.
   * @param txOptions are the transaction options.
   * @returns
   */
  async approveNFT(
    nftContractAddress: string,
    spender: string,
    tokenId: BigNumberish,
    txOptions?: TxOptions
  ) {
    return await this._executeTokenOperation(
      nftContractAddress,
      spender,
      tokenId,
      ContractUtils.encodeERC721ApproveCall,
      txOptions
    );
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
  async callContract(to: string, value: BigNumberish, data: Uint8Array, txOptions?: TxOptions) {
    const call: ICall = {
      to: to,
      value: value,
      data: data,
    };
    return await this._executeUserOperation(call, txOptions);
  }

  /**
   * Approves a token for spending and then calls a contract.
   *
   * This method first approves a certain amount of tokens for a spender and then
   * makes a contract call. It's commonly used in scenarios like interacting with
   * DeFi protocols where a token approval is required before making a transaction.
   *
   * @param tokenAddress Address of the ERC20 token contract.
   * @param spender Address of the spender.
   * @param amount Amount of tokens to approve.
   * @param callData is the encoded data for the subsequent contract call after approval.
   * @param txOptions are the transaction options.
   * @returns
   */
  async approveTokenAndCallContract(
    tokenAddress: string,
    spender: string,
    amount: BigNumberish,
    callData: Uint8Array,
    txOptions?: TxOptions
  ) {
    const approveCallData = ContractUtils.encodeERC20ApproveCall(tokenAddress, spender, amount);
    const calls: Array<ICall> = [
      {
        to: tokenAddress,
        value: BigInt(0),
        data: approveCallData,
      },
      {
        to: spender,
        value: BigInt(0),
        data: callData,
      },
    ];
    return await this.executeBatch(calls, txOptions);
  }

  /**
   * Stakes tokens based on the provided stakeRequestBody
   * This method facilitates token staking by interacting with the staking module.
   *
   * @param stakeRequestBody contains details about the token staking, such as the token address and amount.
   * @param options are the transaction options.
   * @returns
   */
  async stakeToken(stakeRequestBody: IStakeRequestBody, options?: TxOptions) {
    const stakeResponseBody = await this._stakingModule.stake(stakeRequestBody);
    if (stakeResponseBody instanceof Error) {
      throw stakeResponseBody;
    }
    const tokenDetails = await this.getERC20TokenDetails(stakeRequestBody.tokenAddress);
    const amount = ethers.utils.parseUnits(stakeRequestBody.tokenAmount, tokenDetails.decimals);
    const stakeCallData = hexToBytes(stakeResponseBody.encodedABI);

    return await this._processOperation({
      tokenAddress: stakeRequestBody.tokenAddress,
      spender: stakeResponseBody.contractAddress,
      callData: stakeCallData,
      amount: amount,
      options,
    });
  }

  /**
   * Unstakes tokens based on the provided unstakeRequestBody.
   *
   * This method facilitates token unstaking by interacting with the staking module.
   * @param unstakeRequestBody contains details about the token unstaking, such as the token address and amount.
   * @param unStakeTokenAddress is the address of the token to be unstaked.
   * @param options are the transaction options.
   * @returns
   */
  async unstakeToken(
    unstakeRequestBody: IUnstakeRequestBody,
    unStakeTokenAddress: string,
    options?: TxOptions
  ) {
    const unstakeResponseBody = await this._stakingModule.unstake(unstakeRequestBody);
    if (unstakeResponseBody instanceof Error) {
      throw unstakeResponseBody;
    }
    const tokenDetails = await this.getERC20TokenDetails(unstakeRequestBody.tokenAddress);
    const amount = ethers.utils.parseUnits(unstakeRequestBody.tokenAmount, tokenDetails.decimals);
    const unstakeCallData = hexToBytes(unstakeResponseBody.encodedABI);

    return await this._processOperation({
      tokenAddress: unStakeTokenAddress,
      spender: unstakeResponseBody.contractAddress,
      callData: unstakeCallData,
      amount: amount,
      options,
    });
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
    txOptions?: TxOptions
  ): Promise<ISendUserOperationResponse | null | undefined> {
    txOptions = txOptions ?? FuseSDK.defaultTxOptions;
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

  /**
   * Processes a token operation, either executing it directly or approving and then executing.
   *
   * This method checks if the token is native. If it is, it directly executes the operation.
   * If not, it checks the allowance of the token. If the allowance is sufficient, it executes the operation.
   * Otherwise, it first approves the token and then executes the operation.
   *
   * @param tokenAddress is the address of the token involved in the operation.
   * @param spender is the address that will spend or receive the tokens.
   * @param callData is the encoded data for the operation.
   * @param amount is the amount of tokens involved in the operation.
   * @param options are the transaction options.
   * @returns
   */
  private async _processOperation({
    tokenAddress,
    spender,
    callData,
    amount,
    options,
  }: {
    tokenAddress: string;
    spender: string;
    callData: Uint8Array;
    amount: ethers.BigNumberish;
    options?: TxOptions;
  }) {
    if (this._isNativeToken(tokenAddress)) {
      return await this._executeUserOperation(
        {
          to: spender,
          value: amount,
          data: callData,
        },
        options
      );
    }
    const tokenAllowance = await this.getAllowance(tokenAddress, spender);
    if (tokenAllowance >= amount) {
      return await this._executeUserOperation(
        {
          to: spender,
          value: BigInt(0),
          data: callData,
        },
        options
      );
    } else {
      return await this.approveTokenAndCallContract(
        tokenAddress,
        spender,
        amount,
        callData,
        options
      );
    }
  }

  private async _executeTokenOperation(
    contractAddress: string,
    to: string,
    value: ethers.BigNumberish,
    encoder: Function,
    txOptions?: TxOptions
  ) {
    const callData = encoder(contractAddress, to, value);
    const call: ICall = {
      to: contractAddress,
      value: BigInt(0),
      data: callData,
    };
    return await this._executeUserOperation(call, txOptions);
  }
}
