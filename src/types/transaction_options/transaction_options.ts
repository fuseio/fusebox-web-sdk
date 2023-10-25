export class TxOptions {
  public feePerGas: string;
  public feeIncrementPercentage: number;
  public withRetry: boolean;

  public constructor(feePerGas: string, feeIncrementPercentage: number, withRetry: boolean) {
    this.feePerGas = feePerGas;
    this.feeIncrementPercentage = feeIncrementPercentage;
    this.withRetry = withRetry;
  }
}
