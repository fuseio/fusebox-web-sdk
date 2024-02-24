export interface ICollection {
  name: string;
  symbol: string;
  address: string;
}

export class Collection implements ICollection {
  name: string;
  symbol: string;
  address: string;

  constructor({ name, symbol, address }: ICollection) {
    this.name = name;
    this.symbol = symbol;
    this.address = address;
  }

  static fromJson(json: any): Collection {
    return new Collection({
      name: json['collectionName'],
      symbol: json['collectionSymbol'],
      address: json['collectionAddress'],
    });
  }

  toJson(): object {
    return {
      collectionName: this.name,
      collectionSymbol: this.symbol,
      collectionAddress: this.address,
    };
  }
}
