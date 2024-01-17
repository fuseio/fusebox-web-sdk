interface DefaultTxOptions {
  feePerGas: string;
  feeIncrementPercentage: number;
  withRetry: boolean;
  useNonceSequence: boolean;
  // The maximum value for a `uint64` is 18,446,744,073,709,551,615.
  customNonceKey?: number;
}