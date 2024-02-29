import { StakeRequestBody } from './types/staking/stake';
import axios, { AxiosInstance } from 'axios';
import ethers, { BigNumber, BigNumberish } from 'ethers';
import {
  Client,
  EOASigner,
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
import { Variables } from './constants/variables';
import { ERC20, Native, parseTokenDetails, WalletActionResult } from './types';
import { NonceManager } from './utils/nonceManager';
import {
  ExplorerModule,
  NftModule,
  StakingModule,
  TradeModule,
  GraphQLModule
} from './modules';
import { TradeRequestBody, UnstakeRequestBody } from './types';
import { parseUnits } from 'ethers/lib/utils';

export class FuseSDK {
  private readonly _axios: AxiosInstance;
  private readonly _feeTooLowError = 'fee too low';
  private _jwtToken!: string;
  public wallet!: EtherspotWallet;
  public client!: Client;
  public tradeModule!: TradeModule;
  public explorerModule!: ExplorerModule;
  public stakingModule!: StakingModule;
  public nftModule!: NftModule;
  public graphQLModule!: GraphQLModule;
  private _nonceManager!: NonceManager;

  constructor(
    public readonly publicApiKey: string,
    baseUrl = Variables.BASE_URL
  ) {
    this._axios = axios.create({
      baseURL: `https://${baseUrl}/api`,
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        apiKey: publicApiKey,
      },
    });
    this._initializeModules();
  }

  _initializeModules() {
    this._nonceManager = new NonceManager();
    this.tradeModule = new TradeModule(this._axios);
    this.explorerModule = new ExplorerModule(this._axios);
    this.stakingModule = new StakingModule(this._axios);
    this.nftModule = new NftModule(this._axios);
    this.graphQLModule = new GraphQLModule(this._axios);
  }

  /**
   * Initializes the SDK.
   * @param publicApiKey is required to authenticate with the Fuse API.
   * @param credentials are the private key credentials.
   * @param withPaymaster indicates if the paymaster should be used.
   * @param paymasterContext provides additional context for the paymaster.
   * @param opts are the preset builder options.
   * @param clientOpts are the client options.
   * @returns
   */
  static async init(
    publicApiKey: string,
    credentials: EOASigner,
    {
      withPaymaster,
      paymasterContext,
      opts,
      clientOpts,
      jwtToken,
      signature,
      baseUrl = Variables.BASE_URL,
    }: {
      withPaymaster?: boolean;
      paymasterContext?: Record<string, unknown>;
      opts?: IPresetBuilderOpts;
      clientOpts?: IClientOpts;
      jwtToken?: string;
      signature?: string;
      baseUrl?: string;
    } = {}
  ): Promise<FuseSDK> {
    const fuseSDK = new FuseSDK(publicApiKey, baseUrl);

    let paymasterMiddleware;

    if (withPaymaster) {
      paymasterMiddleware = FuseSDK._getPaymasterMiddleware(publicApiKey, baseUrl, paymasterContext);
    }

    fuseSDK.wallet = await FuseSDK._initializeWallet(
      credentials,
      publicApiKey,
      baseUrl,
      opts,
      paymasterMiddleware,
      signature
    );

    if (jwtToken) {
      fuseSDK._jwtToken = jwtToken;
    } else {
      await fuseSDK.authenticate(credentials);
    }

    fuseSDK.client = await Client.init(FuseSDK._getBundlerRpc(publicApiKey, baseUrl), {
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
    txOptions?: typeof Variables.DEFAULT_TX_OPTIONS,
  ): Promise<ISendUserOperationResponse | null | undefined> {
    txOptions = txOptions ?? Variables.DEFAULT_TX_OPTIONS;
    const initialFees = BigInt(txOptions.feePerGas);
    this.setWalletFees(initialFees);

    if (txOptions?.useNonceSequence) {
      this._nonceManager.increment();
      this.wallet.nonceKey = txOptions?.customNonceKey ?? this._nonceManager.retrieve();
    }

    try {
      const userOp = this.wallet.executeBatch(calls);
      return await this.client.sendUserOperation(userOp);
    } catch (e: any) {
      if (txOptions.withRetry && e.message.includes(this._feeTooLowError)) {
        const increasedFees = this._increaseFeeByPercentage(
          initialFees,
          txOptions.feeIncrementPercentage
        );
        this.setWalletFees(increasedFees);
        try {
          const userOp = this.wallet.executeBatch(calls);
          return await this.client.sendUserOperation(userOp);
        } catch (e: any) {
          throw e;
        }
      } else {
        throw e;
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

    if (txOptions?.useNonceSequence) {
      this._nonceManager.increment();
      this.wallet.nonceKey = txOptions?.customNonceKey ?? this._nonceManager.retrieve();
    }

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
   * @returns a ERC20 object containing the token's name, symbol, decimals, and other relevant details.
   */
  async getERC20TokenDetails(tokenAddress: string) {
    if (this._isNativeToken(tokenAddress)) {
      return new Native({ amount: BigInt(0) });
    }
    const toRead = ['name', 'symbol', 'decimals'];
    const token = await Promise.all(
      toRead.map((key) =>
        ContractUtils.readFromContract(this.wallet.proxy.provider, tokenAddress, 'ERC20', key, [])
      )
    );

    const [name, symbol, decimals] = token;

    return parseTokenDetails({
      address: tokenAddress,
      name,
      symbol,
      decimals,
      amount: BigInt(0),
      type: 'ERC-20'
    }) as ERC20;
  }

  /**
   * Authenticates the user using the provided private key
   * @param credentials are the private key credentials.
   * @returns JWT token upon successful authentication.
   */
  async authenticate(credentials: EOASigner): Promise<string> {
    const auth = await SmartWalletAuth.signer(credentials, this.wallet.getSender());
    const response = await this._axios.post('/v2/smart-wallets/auth', auth.toJson());
    this._jwtToken = response.data.jwt;
    return response.data.jwt;
  }

  /**
   * Initializes the wallet with the provided parameters.
   * @param credentials are the private key credentials.
   * @param publicApiKey is required to authenticate with the Fuse API.
   * @param opts are the preset builder options.
   * @param paymasterMiddleware is the middleware for the paymaster.
   * @returns
   */
  private static async _initializeWallet(
    credentials: EOASigner,
    publicApiKey: string,
    baseUrl: string,
    opts?: IPresetBuilderOpts,
    paymasterMiddleware?: UserOperationMiddlewareFn,
    signature?: string
  ): Promise<EtherspotWallet> {
    return EtherspotWallet.init(
      credentials,
      FuseSDK._getBundlerRpc(publicApiKey, baseUrl),
      {
        entryPoint: opts?.entryPoint,
        factory: opts?.factory,
        salt: opts?.salt,
        paymasterMiddleware: opts?.paymasterMiddleware ?? paymasterMiddleware,
        overrideBundlerRpc: opts?.overrideBundlerRpc,
        nonceKey: opts?.nonceKey,
      },
      signature
    );
  }

  /**
   * Retrieves the bundler RPC URL for the provided publicApiKey
   * @param publicApiKey is required to authenticate with the Fuse API.
   * @returns
   */
  private static _getBundlerRpc(publicApiKey: string, baseUrl: string): string {
    return `https://${baseUrl}/api/v0/bundler?apiKey=${publicApiKey}`;
  }

  /**
   * Retrieves the bundler RPC URL for the provided publicApiKey
   * @param publicApiKey is required to authenticate with the Fuse API.
   * @param paymasterContext provides additional context for the paymaster.
   * @returns
   */
  private static _getPaymasterMiddleware(
    publicApiKey: string,
    baseUrl: string,
    paymasterContext?: Record<string, unknown>
  ): UserOperationMiddlewareFn {
    return verifyingPaymaster(
      `https://${baseUrl}/api/v0/paymaster?apiKey=${publicApiKey}`,
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
          throw e;
        }
      } else {
        throw e;
      }
    }
  }

  async _processOperation(
    tokenAddress: string,
    spender: string,
    callData: Uint8Array,
    amount?: BigNumberish,
    txOptions?: typeof Variables.DEFAULT_TX_OPTIONS
  ) {
    if (this._isNativeToken(tokenAddress)) {
      return this.callContract(spender, amount ?? 0, callData, txOptions);
    }

    const tokenAllowance = await this.getAllowance(tokenAddress, spender);

    if (BigNumber.from(tokenAllowance).gte(BigNumber.from(amount))) {

      return this.callContract(spender, 0, callData, txOptions);
    } else {
      const approveCallData = ContractUtils.encodeERC20ApproveCall(
        spender,
        amount!,
      )

      const calls = [
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

      return this.executeBatch(calls, txOptions);
    }
  }

  /**
    * Transfers a specified [amount] of tokens from the user's address to the [recipientAddress].
    *
    * @param tokenAddress - Address of the token contract.
    * @param recipientAddress - Address of the recipient.
    * @param amount - Amount of tokens to transfer.
    * @param options - Additional transaction options.
   */
  async transferToken(
    tokenAddress: string,
    recipientAddress: string,
    amount: BigNumberish,
    data?: Uint8Array,
    txOptions?: typeof Variables.DEFAULT_TX_OPTIONS
  ) {
    data = data ?? new Uint8Array(0);
    if (this._isNativeToken(tokenAddress)) {
      return this.callContract(recipientAddress, amount, data, txOptions);
    } else {
      const transferCallData = ContractUtils.encodeERC20TransferCall(
        recipientAddress,
        amount
      ) as unknown as Uint8Array;

      return this.callContract(tokenAddress, BigInt(0), transferCallData, txOptions);
    }
  }

  /**
   * Transfers an NFT with a given [tokenId] to the [recipientAddress].
   *
   * @param nftContractAddress - Address of the NFT contract.
   * @param recipientAddress - Address of the recipient.
   * @param tokenId - ID of the token to transfer.
   * @param options - Additional transaction options.
   */
  async transferNFT(
    nftContractAddress: string,
    recipientAddress: string,
    tokenId: BigNumberish,
    txOptions?: typeof Variables.DEFAULT_TX_OPTIONS
  ) {
    const transferCallData = ContractUtils.encodeERC271SafeTransferFromCall(
      this.wallet.getSender(),
      recipientAddress,
      tokenId
    ) as unknown as Uint8Array;

    return this.callContract(nftContractAddress, BigInt(0), transferCallData, txOptions);
  }

  /**
   * Retrieves historical actions for a smart wallet, with optional filtering by token address and update time.
   * 
   * @param page The page number to retrieve, default is 1.
   * @param limit Number of items in each page, default is 10.
   * @param tokenAddress Filter actions related to the specified token address.
   * @returns A promise that resolves with a WalletActionResult object containing the historical wallets actions.
   */
  async getWalletActions({
    page = 1,
    limit = 10,
    tokenAddress,
  }: {
    page?: number;
    limit?: number;
    tokenAddress?: string;
  }): Promise<WalletActionResult> {
    const queryParameters: Record<string, any> = {
      page,
      limit,
    };

    if (tokenAddress !== undefined) {
      queryParameters.tokenAddress = tokenAddress;
    }

    try {
      const response = await this._axios.get('/v2/smart-wallets/actions', {
        params: queryParameters,
        headers: {
          Authorization: `Bearer ${this._jwtToken}`,
        },
      });

      return WalletActionResult.fromJson(response.data);
    } catch (error) {
      throw error;
    }
  }

  /**
   *   /// Approves the [spender] to withdraw or transfer a certain [amount] of tokens on behalf of the user's address.
   * 
   * @param tokenAddress - Address of the token contract.
   * @param spender - Address which will spend the tokens.
   * @param amount - Amount of tokens to approve.
   * @param txOptions Additional transaction options.
   * @returns
  */
  async approveToken(
    tokenAddress: string,
    spender: string,
    amount: BigNumberish,
    txOptions?: typeof Variables.DEFAULT_TX_OPTIONS
  ) {
    const approveCallData = ContractUtils.encodeERC20ApproveCall(
      spender,
      amount
    ) as unknown as Uint8Array;

    return this.callContract(tokenAddress, BigInt(0), approveCallData, txOptions);
  }


  /**
    * Approves a [spender] to transfer or withdraw a specific NFT [tokenId] on behalf of the user.
    *
    * @param nftContractAddress - Address of the token contract.
    * @param spender - Address which will spend the tokens.
    * @param tokenId - NFT token ID of item in the collection to approve.
    * @param options - Additional transaction options.
   */
  async approveNFTToken(
    nftContractAddress: string,
    spender: string,
    tokenId: BigNumberish,
    txOptions?: typeof Variables.DEFAULT_TX_OPTIONS
  ) {
    const approveCallData = ContractUtils.encodeERC721ApproveCall(
      spender,
      tokenId
    ) as unknown as Uint8Array;

    return this.callContract(nftContractAddress, BigInt(0), approveCallData, txOptions);
  }

  /**
   * Approves a token for spending and then calls a contract.
   *
   * This method first approves a certain amount of tokens for a spender and then
   * makes a contract call. It's commonly used in scenarios like interacting with
   * DeFi protocols where a token approval is required before making a transaction.
   *
   * @param tokenAddress - is the address of the ERC20 token to be approved.
   * @param spender - is the address that will be approved to spend the tokens.
   * @param value - is the amount of tokens to be approved for spending.
   * @param callData - is the encoded data for the subsequent contract call after approval.
   * @param options - provides additional transaction options.
   */
  async approveTokenAndCallContract(
    tokenAddress: string,
    spender: string,
    amount: BigNumberish,
    callData: Uint8Array,
    txOptions?: typeof Variables.DEFAULT_TX_OPTIONS
  ) {
    const approveCallData = ContractUtils.encodeERC20ApproveCall(
      spender,
      amount
    ) as unknown as Uint8Array;

    const calls = [
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

    return this.executeBatch(calls, txOptions);
  }

  /**
   * Swaps tokens based on the provided [tradeRequestBody].
   *
   * This method facilitates token swaps by interacting with the trade module.
   * @param tradeRequestBody contains details about the token swap, such as the input and output tokens.
   * @param options provides additional transaction options.
   * @returns 
   */
  async swapTokens(tradeRequestBody: TradeRequestBody, txOptions?: typeof Variables.DEFAULT_TX_OPTIONS) {
    const data = await this.tradeModule.requestParameters(tradeRequestBody);
    const spender = data.rawTxn['to'];
    const callData = data.rawTxn['data'];
    const { amountIn, currencyIn } = tradeRequestBody;
    const { decimals } = await this.getERC20TokenDetails(currencyIn);
    const amount = parseUnits(amountIn, decimals.toString());

    return this._processOperation(
      currencyIn,
      spender,
      callData,
      amount,
      txOptions
    );
  }

  /**
    * Stakes tokens based on the provided [stakeRequestBody].
    *
    * This method facilitates token staking by interacting with the staking module.
    * @param stakeRequestBody - contains details about the token staking, such as the token address and amount.
    * @param options - provides additional transaction options.
   */
  async stakeToken(stakeRequestBody: StakeRequestBody, txOptions?: typeof Variables.DEFAULT_TX_OPTIONS) {
    const data = await this.stakingModule.stake(stakeRequestBody);
    const stakeCallData = data.encodedABI as unknown as Uint8Array;
    const spender = data.contractAddress;

    const amountIn = stakeRequestBody.tokenAmount;
    const { decimals } = await this.getERC20TokenDetails(stakeRequestBody.tokenAddress);
    const amount = parseUnits(amountIn, decimals.toString());

    return this._processOperation(
      stakeRequestBody.tokenAddress,
      spender,
      stakeCallData,
      amount,
      txOptions
    );
  }

  /**
   * Unstakes tokens based on the provided [unstakeRequestBody].
   *
   * This method facilitates token unstaking by interacting with the staking module.
   * @param unstakeRequestBody - contains details about the token unstaking, such as the token address and amount.
   * @param unStakeTokenAddress - is the address of the unstake token contract.
   * @param options - provides additional transaction options.
   */
  async unstakeToken(unstakeRequestBody: UnstakeRequestBody, unStakeTokenAddress: string, txOptions?: typeof Variables.DEFAULT_TX_OPTIONS) {
    const data = await this.stakingModule.unstake(unstakeRequestBody);
    const unstakeCallData = data.encodedABI as unknown as Uint8Array;
    const spender = data.contractAddress;
    const amountIn = unstakeRequestBody.tokenAmount;
    const { decimals } = await this.getERC20TokenDetails(unstakeRequestBody.tokenAddress);
    const amount = parseUnits(amountIn, decimals.toString());

    return this._processOperation(
      unStakeTokenAddress,
      spender,
      unstakeCallData,
      amount,
      txOptions
    );
  }
}
