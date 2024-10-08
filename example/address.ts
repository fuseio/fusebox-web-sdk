import { Wallet } from 'ethers'
import { FuseSDK } from '../src'

const main = async () => {
  const credentials = new Wallet(process.env.PRIVATE_KEY as string)
  // Create a project: https://console.fuse.io/build
  const publicApiKey = process.env.PUBLIC_API_KEY as string
  const fuseSDK = await FuseSDK.init(publicApiKey, credentials)
  console.log(`Sender Address is ${fuseSDK.wallet.getSender()}`)
  // Note that the smart account is counterfactual and will be deployed on-chain when you send a transaction.
  console.log(`https://explorer.fuse.io/address/${fuseSDK.wallet.getSender()}`)
}

main()
