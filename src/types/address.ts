/**
 * Interface representing an address with a unique identifier.
 */
export interface IAddress {
  id: string
}

/**
 * Represents an address with a unique identifier.
 */
export class Address implements IAddress {
  id: string

  /**
   * Constructs a new Address instance.
   * @param {IAddress} param0 - Object containing the address id.
   */
  constructor({ id }: IAddress) {
    this.id = id
  }

  /**
   * Creates an Address instance from a JSON object.
   * @param {any} json - JSON object containing the address data.
   * @returns {Address} A new Address instance.
   */
  static fromJson(json: any): Address {
    return new Address(json)
  }

  /**
   * Converts the Address instance to a JSON object.
   * @returns {object} JSON representation of the Address instance.
   */
  toJson(): object {
    return {
      id: this.id,
    }
  }
}
