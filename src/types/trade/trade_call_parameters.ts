export class TradeCallParameters {
  private _methodName: string;
  private _args: any[];
  private _value: string;
  private _rawTxn: Record<string, any>;

  constructor({ methodName, args, value, rawTxn }: { methodName: string; args: any[]; value: string; rawTxn: Record<string, any> }) {
    this._methodName = methodName;
    this._args = args;
    this._value = value;
    this._rawTxn = rawTxn;
  }

  get methodName(): string {
    return this._methodName;
  }

  get args(): any[] {
    return this._args;
  }

  get value(): string {
    return this._value;
  }

  get rawTxn(): Record<string, any> {
    return this._rawTxn;
  }

  static fromJson(json: { methodName: string; args: any[]; value: string; rawTxn: Record<string, any> }): TradeCallParameters {
    return new TradeCallParameters({
      methodName: json.methodName,
      args: json.args,
      value: json.value,
      rawTxn: json.rawTxn,
    });
  }
}
