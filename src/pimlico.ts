import { Chain, createPublicClient, http } from "viem";
import { fuse, fuseSparknet } from 'viem/chains'
import { entryPoint07Address } from "viem/account-abstraction"
import { createSmartAccountClient } from "permissionless"
import { createPimlicoClient } from "permissionless/clients/pimlico"
import { toSafeSmartAccount } from "permissionless/accounts"
import { Owner } from "./types";

export class Pimlico {
  private _owner: Owner
  private _pimlicoUrl: string
  private _isPaymaster?: boolean
  private _chain: Chain

  constructor(owner: Owner, pimlicoUrl: string, isPaymaster?: boolean, isTestnet?: boolean) {
    this._owner = owner
    this._pimlicoUrl = pimlicoUrl
    this._chain = isTestnet ? fuseSparknet : fuse
    this._isPaymaster = isPaymaster
  }

  private _publicClient() {
    return createPublicClient({
      chain: this._chain,
      transport: http(this._chain.rpcUrls.default.http[0]),
    })
  }

  private _pimlicoClient() {
    return createPimlicoClient({
      transport: http(this._pimlicoUrl),
      entryPoint: {
        address: entryPoint07Address,
        version: "0.7",
      },
    })
  }

  private _smartAccount() {
    return toSafeSmartAccount({
      client: this._publicClient(),
      owners: [this._owner],
      entryPoint: {
        address: entryPoint07Address,
        version: "0.7"
      },
      version: "1.4.1",
    })
  }

  public async smartAccountClient() {
    return createSmartAccountClient({
      account: await this._smartAccount(),
      chain: this._chain,
      bundlerTransport: http(this._pimlicoUrl),
      paymaster: this._isPaymaster ? this._pimlicoClient() : undefined,
      userOperation: {
        estimateFeesPerGas: async () => {
          return (await this._pimlicoClient().getUserOperationGasPrice()).fast
        },
      },
    })
  }
}
