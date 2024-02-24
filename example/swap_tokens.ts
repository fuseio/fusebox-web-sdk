import { ethers } from 'ethers';
import { FuseSDK, TradeRequestBody } from '../src';
import { Variables } from '../src/constants/variables';

const main = async () => {
  const credentials = new ethers.Wallet(process.env.PRIVATE_KEY as string);
  const publicApiKey = process.env.PUBLIC_API_KEY as string;
  const fuseSDK = await FuseSDK.init(publicApiKey, credentials);
  const nativeTokenAddress = Variables.NATIVE_TOKEN_ADDRESS;
  const usdcTokenAddress = '0x28C3d1cD466Ba22f6cae51b1a4692a831696391A';
  const res = await fuseSDK.swapTokens(
    new TradeRequestBody({
      amountIn: '0.1',
      currencyIn: nativeTokenAddress,
      currencyOut: usdcTokenAddress,
      recipient: fuseSDK.wallet.getSender(),
    }),
  );

  console.log(`UserOpHash: ${res?.userOpHash}`);
  console.log('Waiting for transaction...');
  const ev = await res?.wait();
  console.log(`Transaction hash: https://explorer.fuse.io/tx/${ev?.transactionHash}`);
};

main();
