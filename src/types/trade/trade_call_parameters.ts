/**
 * Represents the parameters required to make a trade call.
 */
export class TradeCallParameters {
  /**
   * The name of the method to be called.
   */
  private _methodName: string

  /**
   * The arguments to be passed to the method.
   */
  private _args: any[]

  /**
   * The value to be transferred with the call.
   */
  private _value: string

  /**
   * The raw transaction data.
   */
  private _rawTxn: Record<string, any>

  /**
   * Constructs an instance of TradeCallParameters.
   * @param methodName The name of the method to be called.
   * @param args The arguments to be passed to the method.
   * @param value The value to be transferred with the call.
   * @param rawTxn The raw transaction data.
   */
  constructor({
    methodName,
    args,
    value,
    rawTxn,
  }: {
    methodName: string
    args: any[]
    value: string
    rawTxn: Record<string, any>
  }) {
    this._methodName = methodName
    this._args = args
    this._value = value
    this._rawTxn = rawTxn
  }

  /**
   * Gets the method name.
   * @returns The name of the method to be called.
   */
  get methodName(): string {
    return this._methodName
  }

  /**
   * Gets the arguments of the method.
   * @returns The arguments to be passed to the method.
   */
  get args(): any[] {
    return this._args
  }

  /**
   * Gets the value to be transferred with the call.
   * @returns The value as a string.
   */
  get value(): string {
    return this._value
  }

  /**
   * Gets the raw transaction data.
   * @returns The raw transaction data as a record.
   */
  get rawTxn(): Record<string, any> {
    return this._rawTxn
  }

  /**
   * Creates an instance of TradeCallParameters from a JSON object.
   * @param json The JSON object containing the parameters.
   * @returns A new instance of TradeCallParameters populated with the JSON object's values.
   */
  static fromJson(json: {
    methodName: string
    args: any[]
    value: string
    rawTxn: Record<string, any>
  }): TradeCallParameters {
    return new TradeCallParameters({
      methodName: json.methodName,
      args: json.args,
      value: json.value,
      rawTxn: json.rawTxn,
    })
  }
}
