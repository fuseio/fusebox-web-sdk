import { BigNumberish, ethers } from 'ethers';
import { ABI } from '../constants/abis';
import { Variables } from '../constants/variables';

/**
 * A utility class providing methods to interact with contracts.
 * `ContractsUtils` simplifies tasks such as reading from a contract,
 * encoding data for contract calls, and signing off-chain transactions.
 */
export class ContractUtils {
  /**
   * Reads data from a deployed contract using the specified function and parameters.
   * @param provider is the ethers.Provider instance to interact with the Fuse network.
   * @param contractAddress is the address of the deployed contract.
   * @param contractName is the name of the contract.
   * @param methodName is the name of the function to be called.
   * @param params is a list of parameters to be passed to the function.
   * @param jsonInterface  is an optional JSON string representing the contract ABI.
   * @returns  a Promise that resolves to a list of values returned by the contract function.
   */
  public static async readFromContract(
    provider: ethers.providers.Provider,
    contractAddress: string,
    contractName: string,
    methodName: string,
    params: Array<any> = [],
    jsonInterface?: string
  ): Promise<any> {
    const contract = ContractUtils._getDeployedContract(
      contractName,
      contractAddress,
      jsonInterface,
      provider
    );
    const result = await contract.callStatic[methodName](...params);
    return result;
  }

  public static encodeERC721ApproveCall(
    spender: string,
    tokenId: BigNumberish,
  ) {
    const iface = new ethers.utils.Interface(ABI.get('ERC721'));
    return iface.encodeFunctionData('approve', [spender, tokenId]);
  }


  public static encodeERC271SafeTransferFromCall(
    from: string,
    to: string,
    tokenId: BigNumberish,
  ) {
    const iface = new ethers.utils.Interface(ABI.get('ERC721'));
    return iface.encodeFunctionData('safeTransferFrom', [from, to, tokenId]);
  }

  public static encodeERC20ApproveCall(spender: string, amount: BigNumberish): string {
    const iface = new ethers.utils.Interface(ABI.get('ERC20'));
    return iface.encodeFunctionData('approve', [spender, amount]);
  }

  public static encodeERC20TransferCall(recipient: string, amount: BigNumberish): string {
    const iface = new ethers.utils.Interface(ABI.get('ERC20'));
    return iface.encodeFunctionData('transfer', [recipient, amount]);
  }

  /**
 * Checks if the given address is the native token's address.
 * @param tokenAddress is the address to be checked.
 */
  public static isNativeToken(tokenAddress: string): boolean {
    return tokenAddress.toLowerCase() === Variables.NATIVE_TOKEN_ADDRESS.toLowerCase();
  }

  /**
   * Reads data from a specified contract and returns the first result as BigInt.
   * @param provider is the ethers.Provider instance to interact with the Fuse network.
   * @param contractAddress is the address of the deployed contract.
   * @param contractName is the name of the contract.
   * @param methodName is the name of the function to be called.
   * @param params is a list of parameters to be passed to the function.
   * @param jsonInterface  is an optional JSON string representing the contract ABI.
   * @returns  a Promise that resolves to a list of values returned by the contract function.
   */
  public static async readFromContractWithFirstResult(
    provider: ethers.providers.Provider,
    contractAddress: string,
    contractName: string,
    methodName: string,
    params: Array<any> = []
  ): Promise<BigInt> {
    const result = await ContractUtils.readFromContract(
      provider,
      contractAddress,
      contractName,
      methodName,
      params
    );
    return result as BigInt;
  }

  /**
   *  Retrieves the deployed contract instance using the contract name and address.
   * @param contractName is the name of the contract.
   * @param contractAddress is the address of the deployed contract.
   * @param jsonInterface is an optional JSON string representing the contract ABI.
   * @returns  Returns an intance of ethers.Contract
   */
  private static _getDeployedContract(
    contractName: string,
    contractAddress: string,
    jsonInterface?: string,
    provider?: ethers.providers.Provider
  ): ethers.Contract {
    const abi = jsonInterface ?? ABI.get(contractName);
    let contract;
    if (provider) contract = new ethers.Contract(contractAddress, abi, provider);
    else contract = new ethers.Contract(contractAddress, abi);
    return contract;
  }
}
