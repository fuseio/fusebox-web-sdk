import { ethers } from 'ethers';
import { AuthDto } from '../types/auth/auth.dto';

/// Class for handling authentication processes for Fuse Smart Wallets.
export class SmartWalletAuth {
  /**
   * Authenticates the user using the provided private key
   * @param {ethers.Signer} credentials are the Ethereum private key credentials.
   * @param {string} smartWalletAddress is the address of the smart wallet to authenticate.
   * @returns  AuthDto, containing the hash, ownerAddress and signature of the authenticated wallet.
   */
  public static signer = async (
    credentials: ethers.Signer,
    smartWalletAddress?: string
  ): Promise<AuthDto> => {
    const ownerAddress = await credentials.getAddress();
    const input = Uint8Array.from(Buffer.from(ownerAddress.replace('0x', ''), 'hex'));
    const hash = ethers.utils.keccak256(input);
    const signature = await credentials.signMessage(ethers.utils.arrayify(hash));
    return new AuthDto(ownerAddress, signature, hash, smartWalletAddress);
  };
}
