import { ethers } from 'ethers';
import { ABI } from '../constants/abis';
import { bytesToHex, hexToBytes, keccak256 } from 'web3-utils';
import { hexZeroPad, hexlify } from 'ethers/lib/utils';
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

  /**
   * Encodes data for a contract call using the specified function and parameters.
   * @param contractName is the name of the contract.
   * @param contractAddress is the address of the deployed contract.
   * @param methodName is the name of the function to be called.
   * @param params is a list of parameters to be passed to the function.
   * @param jsonInterface is an optional JSON string representing the contract ABI.
   * @returns  Returns encoded data as a hex string.
   */
  public static encodedDataForContractCall(
    contractName: string,
    contractAddress: string,
    methodName: string,
    params: any[] = [],
    jsonInterface?: string
  ) {
    const contract = ContractUtils._getDeployedContract(
      contractName,
      contractAddress,
      jsonInterface
    );
    const data = contract.interface.encodeFunctionData(methodName, params);
    return bytesToHex(data);
  }

  /**
   * Encodes the data for an ERC20 'transfer' operation.
   * @param tokenAddress Address of the ERC20 token contract.
   * @param recipient is the address of the recipient.
   * @param amount is the amount to be transferred.
   * @returns
   */
  public static encodeERC20TransferCall(
    tokenAddress: string,
    recipient: string,
    amount: ethers.BigNumberish
  ) {
    return ContractUtils._encodeContractCall('ERC20', tokenAddress, 'transfer', [
      recipient,
      amount,
    ]);
  }

  /**
   * Encodes the data for an ERC721 'safeTransferFrom' operation.
   * @param from is the address of the sender.
   * @param nftContractAddress is the address of the ERC721 contract.
   * @param to is the address of the recipient.
   * @param tokenId is the ID of the token to be transferred.
   * @returns
   */
  public static encodeERC721SafeTransferCall(
    from: string,
    nftContractAddress: string,
    to: string,
    tokenId: ethers.BigNumberish
  ) {
    const params = [from, to, tokenId];
    const jsonInterface =
      '[{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"safeTransferFrom","inputs":[{"type":"address","name":"from","internalType":"address"},{"type":"address","name":"to","internalType":"address"},{"type":"uint256","name":"tokenId","internalType":"uint256"}]}]';
    return ContractUtils._encodeContractCall(
      'ERC721',
      nftContractAddress,
      'safeTransferFrom',
      params,
      jsonInterface
    );
  }

  /**
   * Encodes the data for an ERC20 'approve' operation.
   * @param tokenAddress Address of the ERC20 token contract.
   * @param spender Address which will be approved to spend the tokens.
   * @param amount Amount of tokens to approve.
   * @returns
   */
  public static encodeERC20ApproveCall(
    tokenAddress: string,
    spender: string,
    amount: ethers.BigNumberish
  ) {
    return ContractUtils._encodeContractCall('ERC20', tokenAddress, 'approve', [spender, amount]);
  }

  /**
   * Encodes the data for an ERC721 'approve' operation.
   * @param tokenAddress Address of the ERC721 token contract.
   * @param spender Address which will be approved to spend the tokens.
   * @param tokenId ID of the token to approve.
   * @returns
   */
  public static encodeERC721ApproveCall(
    tokenAddress: string,
    spender: string,
    tokenId: ethers.BigNumberish
  ) {
    return ContractUtils._encodeContractCall('ERC721', tokenAddress, 'approve', [spender, tokenId]);
  }

  private static _encodeContractCall(
    contractType: string,
    contractAddress: string,
    methodName: string,
    params: any[] = [],
    jsonInterface?: string
  ) {
    return hexToBytes(
      ContractUtils.encodedDataForContractCall(
        contractType,
        contractAddress,
        methodName,
        params,
        jsonInterface
      )
    );
  }
}
