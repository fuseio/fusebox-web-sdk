import { ethers } from 'ethers';
import { FuseSDK, WalletActionResult } from '../src';

const main = async () => {
  const credentials = new ethers.Wallet(process.env.PRIVATE_KEY as string);
  const publicApiKey = process.env.PUBLIC_API_KEY as string;
  const fuseSDK = await FuseSDK.init(publicApiKey, credentials, { withPaymaster: true });
  const res: WalletActionResult = await fuseSDK.getWalletActions({ page: 1, limit: 10 });
  for (const action of res.actions) {
    console.log('action: ', action);
  }
};

main();
