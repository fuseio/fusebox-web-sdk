import { Collectible } from './collectible'

/**
 * Interface representing a user account with an ID, address, and collectibles.
 */
export interface IAccount {
  id: string
  address: string
  collectibles: Collectible[]
}

/**
 * Represents a user account with an ID, address, and a list of collectibles.
 */
export class Account implements IAccount {
  id: string
  address: string
  collectibles: Collectible[]

  /**
   * Constructs a new Account instance.
   * @param {IAccount} param0 - Object containing the account's ID, address, and collectibles.
   */
  constructor({ id, address, collectibles }: IAccount) {
    this.id = id
    this.address = address
    this.collectibles = collectibles
  }

  /**
   * Creates an Account instance from a JSON object.
   * @param {any} json - JSON object containing the account data.
   * @returns {Account} A new Account instance.
   */
  static fromJson(json: any): Account {
    const collectibles: Collectible[] = json.collectibles
      ? json.collectibles.map((collectibleJson: any) => Collectible.fromJson(collectibleJson))
      : []
    return new Account({
      id: json.id,
      address: json.address,
      collectibles,
    })
  }

  /**
   * Converts the Account instance to a JSON object.
   * @returns {object} JSON representation of the Account instance.
   */
  toJson(): object {
    return {
      id: this.id,
      address: this.address,
      collectibles: this.collectibles,
    }
  }
}
