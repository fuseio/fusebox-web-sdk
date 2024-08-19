const variables = {
  NATIVE_TOKEN_ADDRESS: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', // For sending native (ETH/FUSE) tokens
  BASE_URL: process.env.BASE_URL ?? 'api.fuse.io',
  SOCKET_SERVER_URL: process.env.SOCKET_SERVER_URL ?? 'wss://ws.fuse.io/connection/websocket',
  ETHERSPOT_FACTORY: process.env.ETHERSPOT_FACTORY ?? '0x7f6d8F107fE8551160BD5351d5F1514A6aD5d40E',
  DEFAULT_TX_OPTIONS: {
    feeIncrementPercentage: 10,
    withRetry: false,
    useNonceSequence: false,
  },
}

export default variables
