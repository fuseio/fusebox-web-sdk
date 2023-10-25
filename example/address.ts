import { ethers } from 'ethers';
import { FuseSDK } from '../src';

const main = async () => {
  const credentials = new ethers.Wallet(process.env.PRIVATE_KEY as string);
  const publicApiKey = process.env.PUBLIC_API_KEY as string;
  const fuseSDK = await FuseSDK.init(publicApiKey, credentials);
  console.log(`Sender Address is ${fuseSDK.wallet.getSender()}`);
};

main();
