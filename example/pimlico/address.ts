import { Address } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { SmartAccountClient } from 'permissionless'
import { FuseSDK } from '../../src'

const main = async () => {
  const privateKey = process.env.PRIVATE_KEY
  const privateKeyHex: Address = privateKey?.startsWith('0x')
    ? (privateKey as Address)
    : `0x${privateKey}`
  const publicApiKey = process.env.PUBLIC_API_KEY as string
  const account = privateKeyToAccount(privateKeyHex)

  const fuseSDK = await FuseSDK.init(publicApiKey, account, {
    withPaymaster: true,
  })

  const fuseClient = fuseSDK.client as SmartAccountClient

  console.log(`https://explorer.fuse.io/address/${fuseClient.account?.address}`)
}

main()
