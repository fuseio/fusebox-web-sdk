import type { TokenEvent } from '.'

/**
 * Helps in converting a timestamp from a string to a number (milliseconds since epoch)
 * and vice versa.
 */
export class TimestampConverter {
  /**
   * Converts a timestamp string (ISO 8601 format) to its number representation (milliseconds since epoch).
   * @param value The timestamp string to convert.
   * @returns The number representation of the timestamp.
   */
  static fromJson(value: string): number {
    return new Date(value).getTime()
  }

  /**
   * Converts a timestamp number (milliseconds since epoch) to its string representation (ISO 8601 format).
   * @param value The timestamp number to convert.
   * @returns The string representation of the timestamp.
   */
  static toJson(value: number): string {
    return new Date(value).toISOString()
  }
}

export interface WalletActionParams {
  timestamp: string
  id: string
  name: string
  txHash?: string
  status: string
  blockNumber?: number
  description: string
  sent: TokenEvent[]
  received: TokenEvent[]
}

export class WalletAction {
  timestamp: number
  id: string
  name: string
  txHash?: string
  status: string
  blockNumber?: number
  description: string
  sent: TokenEvent[]
  received: TokenEvent[]

  constructor(params: WalletActionParams) {
    this.timestamp = TimestampConverter.fromJson(params.timestamp)
    this.id = params.id
    this.name = params.name
    this.txHash = params.txHash
    this.status = params.status
    this.blockNumber = params.blockNumber
    this.description = params.description
    this.sent = params.sent
    this.received = params.received
  }

  toJson(): object {
    return {
      timestamp: this.timestamp,
      id: this.id,
      name: this.name,
      txHash: this.txHash,
      status: this.status,
      blockNumber: this.blockNumber,
      description: this.description,
      sent: this.sent,
      received: this.received,
    }
  }

  static fromJson(json: any): WalletAction {
    switch (json.name) {
      case 'batchTransaction':
        return BatchTransaction.fromJson(json)
      case 'tokenTransfer':
        return TokenTransfer.fromJson(json)
      case 'tokenReceive':
        return TokenReceive.fromJson(json)
      case 'nftReceive':
        return NftReceive.fromJson(json)
      case 'swapTokens':
        return SwapTokens.fromJson(json)
      case 'nftTransfer':
        return NftTransfer.fromJson(json)
      case 'approveToken':
        return ApproveToken.fromJson(json)
      case 'stakeTokens':
        return StakeTokensAction.fromJson(json)
      case 'unstakeTokens':
        return UnstakeTokensAction.fromJson(json)
      default:
        throw new Error(`Unknown WalletAction type: ${json.name}`)
    }
  }

  isPending(): boolean {
    return this.status === 'pending' || this.status === 'started'
  }

  isFailed(): boolean {
    return this.status === 'failed'
  }

  isConfirmed(): boolean {
    return this.status === 'confirmed' || this.status === 'success' || this.status === 'succeeded'
  }
}

export class BatchTransaction extends WalletAction {
  constructor(params: WalletActionParams) {
    super({ ...params, name: 'batchTransaction' })
  }

  static fromJson(json: any): BatchTransaction {
    const params: WalletActionParams = {
      timestamp: json.updatedAt,
      id: json._id,
      name: json.name,
      txHash: json.txHash,
      status: json.status,
      blockNumber: json.blockNumber,
      description: json.description,
      sent: json.sent,
      received: json.received,
    }

    return new BatchTransaction(params)
  }
}

export class TokenTransfer extends WalletAction {
  constructor(params: WalletActionParams) {
    super({ ...params, name: 'tokenTransfer' })
  }

  static fromJson(json: any): TokenTransfer {
    const params: WalletActionParams = {
      timestamp: json.updatedAt,
      id: json._id,
      name: json.name,
      txHash: json.txHash,
      status: json.status,
      blockNumber: json.blockNumber,
      description: json.description,
      sent: json.sent,
      received: json.received,
    }

    return new TokenTransfer(params)
  }
}

export class TokenReceive extends WalletAction {
  constructor(params: WalletActionParams) {
    super({ ...params, name: 'tokenReceive' })
  }

  static fromJson(json: any): TokenReceive {
    const params: WalletActionParams = {
      timestamp: json.updatedAt,
      id: json._id,
      name: json.name,
      txHash: json.txHash,
      status: json.status,
      blockNumber: json.blockNumber,
      description: json.description,
      sent: json.sent,
      received: json.received,
    }

    return new TokenReceive(params)
  }
}

export class NftReceive extends WalletAction {
  constructor(params: WalletActionParams) {
    super({ ...params, name: 'nftReceive' })
  }

  static fromJson(json: any): NftReceive {
    const params: WalletActionParams = {
      timestamp: json.updatedAt,
      id: json._id,
      name: json.name,
      txHash: json.txHash,
      status: json.status,
      blockNumber: json.blockNumber,
      description: json.description,
      sent: json.sent,
      received: json.received,
    }

    return new NftReceive(params)
  }
}

export class SwapTokens extends WalletAction {
  constructor(params: WalletActionParams) {
    super({ ...params, name: 'swapTokens' })
  }

  static fromJson(json: any): SwapTokens {
    const params: WalletActionParams = {
      timestamp: json.updatedAt,
      id: json._id,
      name: json.name,
      txHash: json.txHash,
      status: json.status,
      blockNumber: json.blockNumber,
      description: json.description,
      sent: json.sent,
      received: json.received,
    }

    return new SwapTokens(params)
  }
}

export class NftTransfer extends WalletAction {
  constructor(params: WalletActionParams) {
    super({ ...params, name: 'nftTransfer' })
  }

  static fromJson(json: any): NftTransfer {
    const params: WalletActionParams = {
      timestamp: json.updatedAt,
      id: json._id,
      name: json.name,
      txHash: json.txHash,
      status: json.status,
      blockNumber: json.blockNumber,
      description: json.description,
      sent: json.sent,
      received: json.received,
    }

    return new NftTransfer(params)
  }
}

export class ApproveToken extends WalletAction {
  constructor(params: WalletActionParams) {
    super({ ...params, name: 'approveToken' })
  }

  static fromJson(json: any): ApproveToken {
    const params: WalletActionParams = {
      timestamp: json.updatedAt,
      id: json._id,
      name: json.name,
      txHash: json.txHash,
      status: json.status,
      blockNumber: json.blockNumber,
      description: json.description,
      sent: json.sent,
      received: json.received,
    }

    return new ApproveToken(params)
  }
}

export class StakeTokensAction extends WalletAction {
  constructor(params: WalletActionParams) {
    super({ ...params, name: 'stakeTokens' })
  }

  static fromJson(json: any): StakeTokensAction {
    const params: WalletActionParams = {
      timestamp: json.updatedAt,
      id: json._id,
      name: json.name,
      txHash: json.txHash,
      status: json.status,
      blockNumber: json.blockNumber,
      description: json.description,
      sent: json.sent,
      received: json.received,
    }

    return new StakeTokensAction(params)
  }
}

export class UnstakeTokensAction extends WalletAction {
  constructor(params: WalletActionParams) {
    super({ ...params, name: 'unstakeTokens' })
  }

  static fromJson(json: any): UnstakeTokensAction {
    const params: WalletActionParams = {
      timestamp: json.updatedAt,
      id: json._id,
      name: json.name,
      txHash: json.txHash,
      status: json.status,
      blockNumber: json.blockNumber,
      description: json.description,
      sent: json.sent,
      received: json.received,
    }

    return new UnstakeTokensAction(params)
  }
}
