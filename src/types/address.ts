export interface IAddress {
  id: string;
}

export class Address implements IAddress {
  id: string;

  constructor({ id }: IAddress) {
    this.id = id;
  }

  static fromJson(json: any): Address {
    return new Address(json);
  }

  toJson(): object {
    return {
      id: this.id,
    };
  }
}
