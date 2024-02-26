import { Address } from "./address";
import { Collection } from "./collection";

/**
 * Interface representing a collectible item with various properties including metadata.
 */
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

/**
 * Represents a unique item or asset in a collection.
 */
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

  /**
   * Constructs a new Collectible instance.
   * @param {ICollectible} param0 - Object containing the collectible item's properties.
   */
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

  /**
   * Decodes the descriptor URI to retrieve metadata.
   * @returns {object | null} The decoded metadata or null if decoding fails.
   */
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

  /**
   * Getter method to retrieve the image URL either directly or from decoded metadata.
   * @returns {string | null} The image URL or null if not available.
   */
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

  /**
   * Creates a Collectible instance from a JSON object.
   * @param {any} json - JSON object containing the collectible data.
   * @returns {Collectible} A new Collectible instance.
   */
  static fromJson(json: any): Collectible {
    return new Collectible({
      ...json,
      createdAt: json['created'], // Mapping 'created' to 'createdAt'
    });
  }
}