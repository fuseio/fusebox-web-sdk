import { Wallet } from 'ethers'
import { FuseSDK } from '../src'

const main = async () => {
  const credentials = new Wallet(process.env.PRIVATE_KEY as string)
  const publicApiKey = process.env.PUBLIC_API_KEY as string
  const fuseSDK = await FuseSDK.init(publicApiKey, credentials)
  const tokenList = await fuseSDK.explorerModule.getTokenList(fuseSDK.wallet.getSender())
  for (const token of tokenList) {
    console.log('Token:', token)
  }
}

main()
