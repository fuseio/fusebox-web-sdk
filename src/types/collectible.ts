import { Address } from "./address";
import { Collection } from "./collection";

export interface ICollectible {
  description?: string;
  name?: string;
  imageURL?: string;
  descriptorUri: string;
  createdAt: string;
  tokenId: string;
  collection: Collection;
  owner: Address;
  creator: Address;
}

export class Collectible implements ICollectible {
  description?: string;
  name?: string;
  imageURL?: string;
  descriptorUri: string;
  createdAt: string;
  tokenId: string;
  collection: Collection;
  owner: Address;
  creator: Address;

  constructor({
    description,
    name,
    imageURL,
    descriptorUri,
    createdAt,
    tokenId,
    collection,
    owner,
    creator,
  }: ICollectible) {
    this.description = description;
    this.name = name;
    this.imageURL = imageURL;
    this.descriptorUri = descriptorUri;
    this.createdAt = createdAt;
    this.tokenId = tokenId;
    this.collection = collection;
    this.owner = owner;
    this.creator = creator;
  }

  decodeDescriptorUri(): object | null {
    if (this.descriptorUri.startsWith('data:application/json')) {
      const base64Content = this.descriptorUri.split(',').pop();
      if (base64Content) {
        const decodedBytes = Buffer.from(base64Content, 'base64');
        return JSON.parse(decodedBytes.toString('utf8'));
      }
    }
    return null;
  }

  // Getter method to retrieve the image URL either directly or from decoded metadata
  get image(): string | null {
    if (this.imageURL) {
      return this.imageURL;
    } else {
      const decodedMetadata = this.decodeDescriptorUri();
      if (decodedMetadata && 'image' in decodedMetadata) {
        return decodedMetadata['image'] as string;
      }
    }
    return null;
  }

  // Method to create an instance from JSON
  static fromJson(json: any): Collectible {
    return new Collectible({
      ...json,
      createdAt: json['created'], // Mapping 'created' to 'createdAt'
    });
  }
}
