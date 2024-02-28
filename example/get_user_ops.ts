import { ethers } from 'ethers';
import { FuseSDK, UserOp } from '../src';

const main = async () => {
  const credentials = new ethers.Wallet(process.env.PRIVATE_KEY as string);
  const publicApiKey = process.env.PUBLIC_API_KEY as string;
  const fuseSDK = await FuseSDK.init(publicApiKey, credentials, { withPaymaster: true, baseUrl: 'api.staging.fuse.io' });
  const userOperations: UserOp[] = await fuseSDK.graphQLModule.getUserOpsBySender(fuseSDK.wallet.getSender())
  for (const action of userOperations) {
    console.log('userOperation: ', action);
  }
};

main();
