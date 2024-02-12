import { FuseSDK } from './sdk';
import { verifyingPaymaster } from 'userop/dist/preset/middleware';

describe('FuseSDK', () => {
  let fuseSDK: FuseSDK;

  beforeEach(() => {
    // Initialize the FuseSDK instance with dummy values for publicApiKey and baseUrl
    fuseSDK = new FuseSDK('dummy-public-api-key', 'dummy-base-url');
  });

  describe('_getPaymasterMiddleware', () => {
    it('should generate the correct paymaster middleware URL', () => {
      const publicApiKey = 'dummy-public-api-key';
      const baseUrl = 'dummy-base-url';
      const paymasterContext = { context: 'dummy-context' };

      const expectedUrl = `https://${baseUrl}/api/v0/paymaster?apiKey=${publicApiKey}`;

      const paymasterMiddleware = FuseSDK._getPaymasterMiddleware(publicApiKey, baseUrl, paymasterContext);

      expect(paymasterMiddleware.url).toBe(expectedUrl);
      expect(paymasterMiddleware.context).toEqual(paymasterContext);
    });

    it('should generate the correct paymaster middleware URL without paymasterContext', () => {
      const publicApiKey = 'dummy-public-api-key';
      const baseUrl = 'dummy-base-url';

      const expectedUrl = `https://${baseUrl}/api/v0/paymaster?apiKey=${publicApiKey}`;

      const paymasterMiddleware = FuseSDK._getPaymasterMiddleware(publicApiKey, baseUrl);

      expect(paymasterMiddleware.url).toBe(expectedUrl);
      expect(paymasterMiddleware.context).toEqual({});
    });
  });

  describe('_getBundlerRpc', () => {
    it('should generate the correct bundler RPC URL', () => {
      const publicApiKey = 'dummy-public-api-key';
      const baseUrl = 'dummy-base-url';

      const expectedUrl = `https://${baseUrl}/api/v0/bundler?apiKey=${publicApiKey}`;

      const bundlerRpcUrl = FuseSDK._getBundlerRpc(publicApiKey, baseUrl);

      expect(bundlerRpcUrl).toBe(expectedUrl);
    });
  });

  // Add more unit tests for other methods in the FuseSDK class

});
