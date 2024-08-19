import { WalletAction } from '.'

/**
 * Represents the result of an action performed on the blockchain.
 *
 * This class provides details about the pagination and the list of actions
 * performed on the blockchain.
 */
export class WalletActionResult {
  hasNextPage: boolean
  hasPrevPage: boolean
  nextPage?: number
  prevPage?: number
  page?: number
  totalDocs: number
  limit: number
  totalPages: number
  pagingCounter: number
  actions: WalletAction[]

  /**
   * Constructs a `WalletActionResult` instance.
   * @param hasNextPage Indicates if there's a next page available.
   * @param hasPrevPage Indicates if there's a previous page available.
   * @param nextPage Provides the number of the next page.
   * @param prevPage Provides the number of the previous page.
   * @param page Provides the current page number.
   * @param totalDocs Provides the total number of documents or actions.
   * @param limit Provides the limit for the number of actions per page.
   * @param totalPages Provides the total number of pages available.
   * @param pagingCounter Provides the current paging counter.
   * @param actions Provides a list of wallet actions.
   */
  constructor({
    hasNextPage,
    hasPrevPage,
    nextPage,
    prevPage,
    page,
    totalDocs,
    limit,
    totalPages,
    pagingCounter,
    actions,
  }: {
    hasNextPage: boolean
    hasPrevPage: boolean
    nextPage?: number
    prevPage?: number
    page?: number
    totalDocs: number
    limit: number
    totalPages: number
    pagingCounter: number
    actions: WalletAction[]
  }) {
    this.hasNextPage = hasNextPage
    this.hasPrevPage = hasPrevPage
    this.nextPage = nextPage
    this.prevPage = prevPage
    this.page = page
    this.totalDocs = totalDocs
    this.limit = limit
    this.totalPages = totalPages
    this.pagingCounter = pagingCounter
    this.actions = actions
  }

  /**
   * Creates a `WalletActionResult` object from a JSON map.
   * @param json JSON representation of a `WalletActionResult`.
   * @returns A new `WalletActionResult` instance.
   */
  static fromJson(json: any): WalletActionResult {
    return new WalletActionResult({
      hasNextPage: json.hasNextPage,
      hasPrevPage: json.hasPrevPage,
      nextPage: json.nextPage,
      prevPage: json.prevPage,
      page: json.page,
      totalDocs: json.totalDocs,
      limit: json.limit,
      totalPages: json.totalPages,
      pagingCounter: json.pagingCounter,
      actions: WalletActionsConverter.fromJson(json.docs),
    })
  }
}

/**
 * Utility for converting between JSON objects and arrays of `WalletAction` objects.
 */
export class WalletActionsConverter {
  /**
   * Converts a JSON array to a list of `WalletAction` objects.
   * @param json JSON array representing wallet actions.
   * @returns Array of `WalletAction` instances.
   */
  static fromJson(json: any[]): WalletAction[] {
    return json.map((item) => WalletAction.fromJson(item))
  }

  /**
   * Converts a list of `WalletAction` objects to a JSON array.
   * @param actions Array of `WalletAction` instances.
   * @returns JSON array representing the wallet actions.
   */
  static toJson(actions: WalletAction[]): any[] {
    return actions.map((action) => action.toJson())
  }
}
