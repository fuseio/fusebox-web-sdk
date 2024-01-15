import {
  BundlerJsonRpcProvider,
  IPresetBuilderOpts,
  UserOperationBuilder,
  UserOperationMiddlewareFn,
} from 'userop';
import { BigNumberish, BytesLike, ethers } from 'ethers';
import { ICall } from 'userop';
import { EntryPoint, EntryPoint__factory } from 'userop/dist/typechain';
import { ERC4337 } from 'userop/dist/constants';
import { signUserOpHash, estimateUserOperationGas, getGasPrice } from 'userop/dist/preset/middleware';
import {
  EtherspotWalletFactory,
  EtherspotWalletFactory__factory,
  EtherspotWallet__factory,
  EtherspotWallet as EtherspotWalletContract,
} from '@etherspot/prime-sdk/dist/sdk/contracts';
import { Variables } from './constants/variables';

export class EtherspotWallet extends UserOperationBuilder {
  private signer: ethers.Signer;
  private provider: ethers.providers.JsonRpcProvider;
  private entryPoint: EntryPoint;
  private factory: EtherspotWalletFactory;
  private initCode: string;
  proxy: EtherspotWalletContract;
  nonceKey: number;

  private constructor(signer: ethers.Signer, rpcUrl: string, opts?: IPresetBuilderOpts) {
    super();
    this.signer = signer;
    this.provider = new BundlerJsonRpcProvider(rpcUrl).setBundlerRpc(opts?.overrideBundlerRpc);
    this.entryPoint = EntryPoint__factory.connect(
      opts?.entryPoint || ERC4337.EntryPoint,
      this.provider
    );
    this.factory = EtherspotWalletFactory__factory.connect(
      opts?.factory || Variables.ETHERSPOT_FACTORY,
      this.provider
    );
    this.initCode = '0x';
    this.nonceKey = opts?.nonceKey ?? 0;
    this.proxy = EtherspotWallet__factory.connect(ethers.constants.AddressZero, this.provider);
  }

  /// Resolves the nonce and init code for the EtherspotWallet contract creation.
  private resolveAccount: UserOperationMiddlewareFn = async (ctx) => {
    ctx.op.nonce = await this.entryPoint.getNonce(ctx.op.sender, this.nonceKey);
    ctx.op.initCode = ctx.op.nonce.eq(0) ? this.initCode : '0x';
  };

  /// Initializes a EtherspotWallet object and returns it.
  public static async init(
    signer: ethers.Signer,
    rpcUrl: string,
    opts?: IPresetBuilderOpts,
    signature?: string,
  ): Promise<EtherspotWallet> {
    const instance = new EtherspotWallet(signer, rpcUrl, opts);

    const eoa = await instance.signer.getAddress();
    const sca = await instance.factory.getAddress(eoa, ethers.BigNumber.from(opts?.salt ?? 0))
    instance.proxy = EtherspotWallet__factory.connect(sca, instance.provider);

    const base = instance
      .useDefaults({
        sender: instance.proxy.address,
        signature: signature ?? await instance.signer.signMessage(
          ethers.utils.arrayify(ethers.utils.keccak256('0xdead'))
        ),
      })
      .useMiddleware(instance.resolveAccount)
      .useMiddleware(getGasPrice(instance.provider));

    const withPM = opts?.paymasterMiddleware
      ? base.useMiddleware(opts.paymasterMiddleware)
      : base.useMiddleware(estimateUserOperationGas(instance.provider));

    return withPM.useMiddleware(signUserOpHash(instance.signer));
  }

  /// Executes a transaction on the network.
  execute(to: string, value: BigNumberish, data: BytesLike) {
    return this.setCallData(this.proxy.interface.encodeFunctionData('execute', [to, value, data]));
  }

  /// Executes a batch transaction on the network.
  executeBatch(calls: Array<ICall>) {
    return this.setCallData(
      this.proxy.interface.encodeFunctionData('executeBatch', [
        calls.map((call) => call.to),
        calls.map((call) => call.value),
        calls.map((call) => call.data),
      ])
    );
  }
}
