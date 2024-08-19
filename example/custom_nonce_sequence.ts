import { Wallet } from 'ethers'
import { parseEther } from 'ethers/lib/utils'
import { FuseSDK } from '../src'
import Variables from '../src/constants/variables'

const main = async () => {
  const credentials = new Wallet(process.env.PRIVATE_KEY as string)
  const publicApiKey = process.env.PUBLIC_API_KEY as string
  const fuseSDK = await FuseSDK.init(publicApiKey, credentials, {
    withPaymaster: true,
  })

  // You can use any other "to" address and any other "value"
  const to = 'YOUR_RECEIVER_ADDRESS'
  const value = parseEther('0.001')
  const data = Uint8Array.from([])
  const txOptions = {
    ...Variables.DEFAULT_TX_OPTIONS,
    useNonceSequence: true,
  }
  await fuseSDK.callContract(to, value, data, {
    ...txOptions,
    customNonceKey: 1000,
  })
  await fuseSDK.callContract(to, value, data, {
    ...txOptions,
    customNonceKey: 184467440737,
  })
}

main()
