export class Variables {
  static FUSE_CHAIN_ID = process.env.FUSE_CHAIN_ID ?? 122;
  static FUSE_RPC_URL = process.env.FUSE_RPC_URL ?? 'https://rpc.fuse.io';
  static DEFAULT_GAS_LIMIT = process.env.DEFAULT_GAS_LIMIT ?? 700000;
  static NATIVE_TOKEN_ADDRESS = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'; // For sending native (ETH/FUSE) tokens
  static BASE_URL = process.env.BASE_URL ?? 'api.fuse.io';
  static SOCKET_SERVER_URL = process.env.SOCKET_SERVER_URL ?? 'wss://ws.fuse.io/connection/websocket';
  static ETHERSPOT_FACTORY = process.env.ETHERSPOT_FACTORY ?? '0x7f6d8F107fE8551160BD5351d5F1514A6aD5d40E';
  static DEFAULT_TX_OPTIONS = {
    feePerGas: '1000000',
    feeIncrementPercentage: 10,
    withRetry: false,
  };
}
