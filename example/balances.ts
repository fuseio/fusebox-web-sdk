import { ethers } from 'ethers';
import { FuseSDK } from '../src';

const main = async () => {
  const credentials = new ethers.Wallet(process.env.PRIVATE_KEY as string);
  // Create a project: https://console.fuse.io/build
  const publicApiKey = process.env.PUBLIC_API_KEY as string;
  const fuseSDK = await FuseSDK.init(publicApiKey, credentials);
  const address = fuseSDK.wallet.getSender();
  const nfts = await fuseSDK.balancesModule.getNFTs(address);
  const erc20 = await fuseSDK.balancesModule.getTokenList(address)
  for (const nft of nfts.collectibles) {
    console.log(`NFT: ${nft.name} - ${nft.tokenId}`);
  }

  for (const token of erc20) {
    console.log(`Token: ${token.name} - ${token.symbol}`);
  }
};

main();
