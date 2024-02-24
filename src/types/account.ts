import { Collectible } from "./collectible";

export interface IAccount {
  id: string;
  address: string;
  collectibles: Collectible[];
}

export class Account implements IAccount {
  id: string;
  address: string;
  collectibles: Collectible[];

  constructor({ id, address, collectibles }: IAccount) {
    this.id = id;
    this.address = address;
    this.collectibles = collectibles;
  }

  static fromJson(json: any): Account {
    const collectibles: Collectible[] = json.collectibles
      ? json.collectibles.map((collectibleJson: any) => Collectible.fromJson(collectibleJson))
      : [];
    return new Account({
      id: json.id,
      address: json.address,
      collectibles,
    });
  }

  toJson(): object {
    return {
      id: this.id,
      address: this.address,
      collectibles: this.collectibles,
    };
  }
}
