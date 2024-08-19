/**
 * Interface representing a collection with a name, symbol, and address.
 */
export interface ICollection {
  name: string
  symbol: string
  address: string
}

/**
 * Represents a collection with a name, symbol, and address.
 */
export class Collection implements ICollection {
  name: string
  symbol: string
  address: string

  /**
   * Constructs a new Collection instance.
   * @param {ICollection} param0 - Object containing the collection's name, symbol, and address.
   */
  constructor({ name, symbol, address }: ICollection) {
    this.name = name
    this.symbol = symbol
    this.address = address
  }

  /**
   * Creates a Collection instance from a JSON object.
   * @param {any} json - JSON object containing the collection data.
   * @returns {Collection} A new Collection instance.
   */
  static fromJson(json: any): Collection {
    return new Collection({
      name: json.collectionName,
      symbol: json.collectionSymbol,
      address: json.collectionAddress,
    })
  }

  /**
   * Converts the Collection instance to a JSON object.
   * @returns {object} JSON representation of the Collection instance.
   */
  toJson(): object {
    return {
      collectionName: this.name,
      collectionSymbol: this.symbol,
      collectionAddress: this.address,
    }
  }
}
