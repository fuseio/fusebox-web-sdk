import { Wallet } from 'ethers'
import { FuseSDK, UnstakeRequestBody } from '../src'
import Variables from '../src/constants/variables'

const main = async () => {
  const credentials = new Wallet(process.env.PRIVATE_KEY as string)
  const publicApiKey = process.env.PUBLIC_API_KEY as string
  const fuseSDK = await FuseSDK.init(publicApiKey, credentials, {
    withPaymaster: true,
  })
  const nativeTokenAddress = Variables.NATIVE_TOKEN_ADDRESS
  const res = await fuseSDK.unstakeToken(
    new UnstakeRequestBody({
      accountAddress: fuseSDK.wallet.getSender(),
      tokenAmount: '0.007',
      tokenAddress: nativeTokenAddress,
    }),
    '0xb1DD0B683d9A56525cC096fbF5eec6E60FE79871'
  )

  console.log(`UserOpHash: ${res?.userOpHash}`)
  console.log('Waiting for transaction...')
  const ev = await res?.wait()
  console.log(`Transaction hash: https://explorer.fuse.io/tx/${ev?.transactionHash}`)
}

main()
