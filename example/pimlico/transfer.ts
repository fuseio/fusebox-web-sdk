import { Address, parseEther } from 'viem'
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

  const to: Address = '0xRECEIVER_ADDRESS'
  const value = parseEther('0.001')

  const fuseClient = fuseSDK.client as SmartAccountClient

  const userOpHash = await fuseClient.sendUserOperation({
    calls: [
      {
        to,
        value,
      },
    ],
  })

  console.log('UserOpHash:', userOpHash)
  console.log('Waiting for transaction...')

  const userOpReceipt = await fuseClient.waitForUserOperationReceipt({
    hash: userOpHash,
  })
  console.log(`Transaction hash: https://explorer.fuse.io/tx/${userOpReceipt.receipt.transactionHash}`)
}

main()
