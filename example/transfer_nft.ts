import { Wallet } from 'ethers'
import { FuseSDK } from '../src'

const main = async () => {
  const credentials = new Wallet(process.env.PRIVATE_KEY as string)
  const publicApiKey = process.env.PUBLIC_API_KEY as string
  const fuseSDK = await FuseSDK.init(publicApiKey, credentials, {
    withPaymaster: true,
  })
  const nftContractAddress = 'YOUR_TOKEN'
  const recipientAddress = 'RECEIVER_ADDRESS'
  const tokenId = 1
  const res = await fuseSDK.transferNFT(nftContractAddress, recipientAddress, tokenId)

  console.log(`UserOpHash: ${res?.userOpHash}`)
  console.log('Waiting for transaction...')

  const receipt = await res?.wait()
  console.log(`Transaction hash: https://explorer.fuse.io/tx/${receipt?.transactionHash}`)
}

main()
