export class AuthDto {
  ownerAddress: string;
  smartWalletAddress?: string;
  signature: string;
  hash: string;

  constructor(ownerAddress: string, signature: string, hash: string, smartWalletAddress?: string) {
    this.ownerAddress = ownerAddress;
    this.signature = signature;
    this.hash = hash;
    this.smartWalletAddress = smartWalletAddress;
  }

  toJson(): Record<string, unknown> {
    return {
      ownerAddress: this.ownerAddress,
      smartWalletAddress: this.smartWalletAddress,
      signature: this.signature,
      hash: this.hash,
    };
  }

  static fromJson(json: Record<string, unknown>): AuthDto {
    return new AuthDto(
      json.ownerAddress as string,
      json.signature as string,
      json.hash as string,
      json.smartWalletAddress as string
    );
  }
}
