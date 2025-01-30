import { Account, Chain, Transport, WalletClient } from "viem";

export type OwnerWalletClient = WalletClient<Transport, Chain | undefined, Account>

export type Owner = Account | OwnerWalletClient
