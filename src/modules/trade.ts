import { AxiosInstance } from 'axios';
import {
  IIntervalStats,
  IToken,
  IntervalStats,
  TimeFrame,
  Trade,
  TradeCallParameters,
  TradeRequestBody,
  parseTokenDetails
} from '../types';

/**
 * Represents a module for trading operations.
 */
export class TradeModule {
  private readonly _axios: AxiosInstance;

  constructor(axios: AxiosInstance) {
    this._axios = axios;
  }

  /**
   * Fetches the parameters required for a trade request.
   * @param tradeRequestBody - The trade request body.
   * @returns A promise that resolves to the trade call parameters.
   * @throws If an error occurs during the request.
   */
  async requestParameters(tradeRequestBody: TradeRequestBody): Promise<TradeCallParameters> {
    try {
      const response = await this._axios.post('/v0/trade/swap/requestparameters', tradeRequestBody);
      if (response.status === 201) {
        return TradeCallParameters.fromJson(response.data);
      }
      throw response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get a quote for a trade request.
   * @param tradeRequestBody - The trade request body.
   * @returns A promise that resolves to the trade quote.
   * @throws If an error occurs during the request.
   */
  async quote(tradeRequestBody: TradeRequestBody): Promise<Trade> {
    try {
      const response = await this._axios.post('/v0/trade/swap/quote', tradeRequestBody);
      if (response.status === 201) {
        return Trade.fromJson(response.data['data']['info']);
      }
      throw new Error('Failed to get quote');
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves the current price for the given token address.
   * @param tokenAddress - The address of the token.
   * @returns A promise that resolves to the token price.
   * @throws If an error occurs during the request.
   */
  async price(tokenAddress: string): Promise<string> {
    try {
      const response = await this._axios.get('/v0/trade/price/' + tokenAddress);
      if (response.status === 200) {
        return response.data.data.price ?? '0';
      }
      throw new Error('Failed to get price for token');
    } catch (error) {
      throw error;
    }
  }

  /**
   * Fetches the price change for a given token address.
   * @param tokenAddress - The address of the token.
   * @returns A promise that resolves to the token price change.
   * @throws If an error occurs during the request.
   */
  async priceChange(tokenAddress: string): Promise<string> {
    try {
      const response = await this._axios.get('/v0/trade/pricechange/' + tokenAddress);
      if (response.status === 200) {
        return response.data['data']['priceChange'] ?? '0';
      }
      throw response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves the interval stats for a token with the given address and time frame.
   * @param tokenAddress - The address of the token.
   * @param timeFrame - The time frame for the interval stats.
   * @returns A promise that resolves to an array of interval stats.
   * @throws If an error occurs during the request.
   */
  async interval(tokenAddress: string, timeFrame: TimeFrame): Promise<IntervalStats[]> {
    try {
      const response = await this._axios.get('/v0/trade/pricechange/interval/' + timeFrame.toUpperCase() + '/' + tokenAddress);
      if (response.status === 200) {
        return response.data.data.map((item: IIntervalStats) => {
          return IntervalStats.fromJson(item);
        });
      }
      throw response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Fetches the list of available tokens.
   * @returns A promise that resolves to an array of tokens.
   * @throws If an error occurs during the request.
   */
  async fetchTokens(): Promise<IToken[]> {
    try {
      const response = await this._axios.get('/v0/trade/tokens');
      if (response.status === 200) {
        return response.data.data.tokens.map((item: IToken) => {
          return parseTokenDetails(item);
        });
      }
      throw response;
    } catch (error) {
      throw error;
    }
  }
}
