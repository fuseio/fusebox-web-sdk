/**
 * Represents an authentication object containing the owner's address, signature, and hash.
 * Use `AuthDto.fromJson` to create an instance from a JSON object.
 */
export class AuthDto {
  ownerAddress: string;
  smartWalletAddress?: string;
  signature: string;
  hash: string;

  /**
   * Creates an instance of AuthDto.
   * @param ownerAddress - The owner's address.
   * @param signature - The owner's signature of the hash.
   * @param hash - The hash of the data to be signed.
   * @param smartWalletAddress - The smart wallet address (optional).
   */
  constructor(ownerAddress: string, signature: string, hash: string, smartWalletAddress?: string) {
    this.ownerAddress = ownerAddress;
    this.signature = signature;
    this.hash = hash;
    this.smartWalletAddress = smartWalletAddress;
  }

  /**
   * Converts the AuthDto object to JSON format.
   * @returns The JSON representation of the AuthDto object.
   */
  toJson(): Record<string, unknown> {
    return {
      ownerAddress: this.ownerAddress,
      smartWalletAddress: this.smartWalletAddress,
      signature: this.signature,
      hash: this.hash,
    };
  }

  /**
   * Creates an AuthDto object from a JSON representation.
   * @param json - The JSON representation of the AuthDto object.
   * @returns The AuthDto object.
   */
  static fromJson(json: Record<string, unknown>): AuthDto {
    return new AuthDto(
      json.ownerAddress as string,
      json.signature as string,
      json.hash as string,
      json.smartWalletAddress as string
    );
  }
}
