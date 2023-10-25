export interface ITokenDetails {
  symbol: string;
  name: string;
  decimals: number;
  address: string;
  amount: bigint;
  logoURI?: string;
}
