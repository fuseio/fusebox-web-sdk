import { Wallet } from 'ethers'
import { parseEther } from 'ethers/lib/utils'
import { FuseSDK } from '../src'

const main = async () => {
  const credentials = new Wallet(process.env.PRIVATE_KEY as string)
  const publicApiKey = process.env.PUBLIC_API_KEY as string
  const fuseSDK = await FuseSDK.init(publicApiKey, credentials, {
    withPaymaster: true,
  })
  const tokenAddress = 'YOUR_TOKEN'
  const to = 'RECEIVER_ADDRESS'
  const amount = parseEther('0.001')
  const data = Uint8Array.from([])
  const res = await fuseSDK.transferToken(tokenAddress, to, amount, data)

  console.log(`UserOpHash: ${res?.userOpHash}`)
  console.log('Waiting for transaction...')

  const receipt = await res?.wait()
  console.log(`Transaction hash: https://explorer.fuse.io/tx/${receipt?.transactionHash}`)
}

main()
