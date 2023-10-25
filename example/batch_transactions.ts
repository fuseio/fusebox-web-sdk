import { ethers } from 'ethers';
import { FuseSDK } from '../src';
import { ContractUtils } from '../src/utils/contracts';

const main = async () => {
  const credentials = new ethers.Wallet(process.env.PRIVATE_KEY as string);
  const publicApiKey = process.env.PUBLIC_API_KEY as string;
  const fuseSDK = await FuseSDK.init(publicApiKey, credentials);
  const usdcTokenAddress = '0x620fd5fa44be6af63715ef4e65ddfa0387ad13f5';

  const res = await fuseSDK.executeBatch([
    {
      to: 'RECIPIENT_ADDRESS',
      value: BigInt(1000000000000),
      data: '0x',
    },
    {
      to: usdcTokenAddress,
      value: BigInt(0),
      data: ContractUtils.encodeERC20TransferCall(
        usdcTokenAddress,
        'RECIPIENT_ADDRESS',
        BigInt(100000)
      ),
    },
  ]);

  console.log(`UserOpHash: ${res?.userOpHash}`);
  console.log('Waiting for transaction');

  const receipt = await res?.wait();
  console.log('Transaction Hash: ', receipt?.transactionHash);
};

main();
