<p align="center">                    
<img  src="https://raw.githubusercontent.com/fuseio/fusebox-web-sdk/master/art/sdk_logo.svg" height="170">                    
</p>                    

<p align="center">                    
<a href="https://img.shields.io/badge/License-MIT-green"><img src="https://img.shields.io/badge/License-MIT-green" alt="MIT License"></a>                  
</p>

- [Introduction](#introduction)
  - [Benefits of using FuseBox TS SDK](#benefits-of-using-fusebox-ts-sdk)
  - [Purpose of the SDK](#purpose-of-the-sdk)
- [Instantiation](#instantiation)
  - [Examples](#examples)
    - [Get Address](#get-address)
    - [Send transactions](#send-transactions)
    - [Send batch transactions](#send-batch-transactions)
    - [Staking](#staking)
    - [Unstake](#unstake)
    - [Trading](#trading)
- [Features](#features)
    - [Get Address](#get-address-1)
    - [Send transactions](#send-transactions-1)
    - [Send batch transactions](#send-batch-transactions-1)
    - [Sponsored Transactions](#sponsored-transactions)
    - [Staking](#staking-1)
    - [Trading](#trading-1)
- [Troubleshooting](#troubleshooting)
- [Limitations](#limitations)

## Introduction

The FuseBox TS SDK is a set of tools for creating, managing, and engaging with FuseBox TS SDK in client applications. FuseBox TS SDK lets users create smart contract wallets([Based on ERC-4337](https://eips.ethereum.org/EIPS/eip-4337)) associated with each user's Externally Owned Account (EOA) that provide added security compared to traditional EOAs with a single private key. With FuseBox TS SDK, users can deposit funds that no one else can control and withdraw at any time.

### Benefits of using FuseBox TS SDK
Using FuseBox TS SDK provides several benefits, including:

- **Enhanced security**: FuseBox TS SDK are non-custodial accounts that allow users to deposit funds that no one else can control and withdraw at any time. Each Fuse Smart Wallet is a smart contract associated with the user's EOA and can only be controlled by that user.
- **Enhanced UX**: FuseBox TS SDK support gasless transactions, improving the user experience and making it more seamless to interact with the blockchain.
- **Better developer experience**: The FuseBox TS SDK abstracts away the complexities of web3 development, such as cryptography, wallet management, and smart contract interactions, making it easier for developers to build blockchain-based applications

### Purpose of the SDK

The SDK is designed to make it easy for developers to create, manage, and engage with FuseBox TS SDK in their applications. The SDK provides pre-built functions and utilities, allowing developers to interact with FuseBox TS SDK securely and efficiently.


## Instantiation

```typescript
import { FuseSDK } from "@fuseio/fusebox-web-sdk";
import { ethers } from 'ethers';

// Create a project: https://console.fuse.io/build
const apiKey = 'YOUR_PUBLIC_API_KEY';
const credentials = new ethers.Wallet("PRIVATE_KEY");
const fuseSDK = await FuseSDK.init(apiKey, credentials);
```

### Examples

#### [Get Address](./example/address.ts)

#### [Send transactions](./example/transfer.ts)

#### [Send batch transactions](./example/batch.ts)

#### [Staking](./example/stake_tokens.ts)

#### [Unstake](./example/unstake_tokens.ts)

#### [Trading](./example/swap_tokens.ts)


## Features

The FuseBox TS SDK provides several features that allow developers to create, manage, and engage with FuseBox TS SDK in their applications. Some of the key features include:

#### Get Address

Gets the address of the wallet created.

```typescript
console.log(`Smart contract wallet address: ${fuseSDK.wallet.getSender()}`);
```

#### Send transactions

Send transactions, including ERC20 and NFT transfers and interaction with arbitrary smart contracts.

```typescript
const tokenAddress = "YOUR_TOKEN";
const to = "RECEIVER_ADDRESS";
const amount = parseUnits('10000', DECIMAL); //Amount should be set in WEI. `DECIMAL` should be a numeric value
const data = Uint8Array.from([]);
const res = await fuseSDK.transferToken(
  tokenAddress,
  to,
  amount,
  data
);
console.log(`UserOpHash: ${res.userOpHash}`);
console.log(`Waiting for transaction...`);
const ev = await res.wait();
console.log(`Transaction hash: https://explorer.fuse.io/tx/${ev?.transactionHash}`);
```

#### Send batch transactions

The process of grouping multiple transactions into a single batch to be processed together. This is often done to optimize processing time and reduce transaction fees.

```typescript
// Approve and transfer in a single batch
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

const res = await fuseSDK.executeBatch(calls, txOptions);

console.log(`UserOpHash: ${res.userOpHash}`);

console.log(`Waiting for transaction...`);
const ev = await res.wait();
console.log(`Transaction hash: https://explorer.fuse.io/tx/${ev?.transactionHash}`);
```

#### Sponsored Transactions

Sponsored transactions are the ability to pay for another user’s transaction fees. To do this, the Fuse operator must enable the sponsored feature in his project and deposit some funds into the paymaster contract. The SDK provides a middleware to check if the project is sponsored and the amount of funds available for sponsoring.

To use this feature, you must first initialize the SDK with the `withPaymaster` parameter set to `true`.

```typescript
import { FuseSDK } from "@fuseio/fusebox-web-sdk";
import { ethers } from 'ethers';

const apiKey = 'YOUR_PUBLIC_API_KEY';
const credentials = new ethers.Wallet("PRIVATE_KEY");
const fuseSDK = await FuseSDK.init(apiKey, credentials, { withPaymaster: true });
```

#### Staking

The SDK provides a module for staking. This module allows users to stake their tokens and earn rewards.

Currently, the SDK supports staking for the following tokens: Native Fuse & VoltToken

```typescript

const stakingOptions = await fuseSDK.stakingModule.getStakingOptions(); // Get staking options

const nativeTokenAddress = Variables.NATIVE_TOKEN_ADDRESS;
const res = await fuseSDK.stakeToken(
  new StakeRequestBody({
    accountAddress: fuseSDK.wallet.getSender(),
    tokenAmount: '0.01',
    tokenAddress: nativeTokenAddress,
  })
);

console.log(`UserOpHash: ${res?.userOpHash}`);
console.log('Waiting for transaction...');
const ev = await res?.wait();
console.log(`Transaction hash: https://explorer.fuse.io/tx/${ev?.transactionHash}`);
```

#### Trading

Smart Wallet can buy and sell popular cryptocurrencies like Bitcoin and Ethereum, Stable-coins. Behind the scenes, it uses [voltage.finance](https://voltage.finance/) decentralized exchange.

```typescript
const nativeTokenAddress = Variables.NATIVE_TOKEN_ADDRESS;
const usdcTokenAddress = '0x28C3d1cD466Ba22f6cae51b1a4692a831696391A';
const res = await fuseSDK.swapTokens(
  new TradeRequest(
    nativeTokenAddress,
    usdcTokenAddress,
    parseUnits('1', 18),
    true,
  ),
);

console.log(`UserOpHash: ${res?.userOpHash}`);
console.log('Waiting for transaction...');
const ev = await res?.wait();
console.log(`Transaction hash: https://explorer.fuse.io/tx/${ev?.transactionHash}`);
```

## Troubleshooting

1. **User op cannot be replaced: fee too low.**

   If you're getting the `User op cannot be replaced: fee too low` error, it means that the gas price you set is too low. You can increase the gas price by setting the `TxOptions` parameter when sending a transaction. To replace an user operation, a new user operation must have at least 10% higher `maxPriorityFeePerGas` and 10% higher `maxPriorityFeePerGas` than the one in the user operation mempool.

To replace the user operation, the new gas price must be at least 10% higher.

```typescript
const tokenAddress = "YOUR_TOKEN";
const to = "RECEIVER_ADDRESS";
const amount = parseUnits('10000', DECIMAL); //Amount should be set in WEI. `DECIMAL` should be a numeric value
const data = Uint8Array.from([]);

const res = await fuseSDK.transferToken(
  tokenAddress,
  to,
  amount,
  data,
  {
    withRetry: true,
    feeIncrementPercentage: 11,
  }
);
console.log(`UserOpHash: ${res.userOpHash}`);
console.log(`Waiting for transaction...`);
const ev = await res.wait();
console.log(`Transaction hash: https://explorer.fuse.io/tx/${ev?.transactionHash}`);
```

## Limitations

The FuseBox TS SDK works only on the Fuse & Fuse Sparknet networks, an EVM based chain L1 blockchain. Support for other blockchains is planned for the future.

If you have any questions or feedback, please get in touch with our support team at support@fuse.io.
