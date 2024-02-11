import { ethers } from 'ethers';
import { FuseSDK } from '../src';
import { parseEther } from 'ethers/lib/utils';
import { Variables } from '../src/constants/variables';

const main = async () => {
  const credentials = new ethers.Wallet(process.env.PRIVATE_KEY as string);
  const publicApiKey = process.env.PUBLIC_API_KEY as string;
  const fuseSDK = await FuseSDK.init(publicApiKey, credentials, { withPaymaster: true });

  // You can use any other "to" address and any other "value"
  const to = "YOUR_RECEIVER_ADDRESS";
  const value = parseEther("0.001");
  const data = Uint8Array.from([]);
  const txOptions = { ...Variables.DEFAULT_TX_OPTIONS, useNonceSequence: true };
  const res = await fuseSDK.executeBatch([
    { to, value, data },
    { to, value, data },
    { to, value, data },
  ], txOptions)

  console.log(`UserOpHash: ${res?.userOpHash}`);
  console.log('Waiting for transaction...');

  const receipt = await res?.wait();
  console.log('Transaction Hash:', receipt?.transactionHash)
};

main();
