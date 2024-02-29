// src/sdk.test.ts

import { FuseSDK } from './sdk';

describe('FuseSDK', () => {
  describe('init', () => {
    it('should initialize the SDK with the provided parameters', async () => {
      // Create an instance of FuseSDK
      const fuseSDK = new FuseSDK('publicApiKey', 'baseUrl');

      // Call the init method with the necessary parameters
      const result = await fuseSDK.init('publicApiKey', 'credentials', {
        withPaymaster: true,
        paymasterContext: { key: 'value' },
        opts: { option: 'value' },
        clientOpts: { option: 'value' },
        jwtToken: 'jwtToken',
        signature: 'signature',
        baseUrl: 'baseUrl',
      });

      // Assert the expected behavior or outcome
      expect(result).toBeInstanceOf(FuseSDK);
      expect(result.wallet).toBeDefined();
      expect(result.client).toBeDefined();
    });

    // Add more test cases to cover different scenarios and edge cases
  });

  describe('authenticate', () => {
    it('should authenticate the user using the provided credentials', async () => {
      // Create an instance of FuseSDK
      const fuseSDK = new FuseSDK('publicApiKey', 'baseUrl');

      // Call the authenticate method with the necessary parameters
      const result = await fuseSDK.authenticate('credentials');

      // Assert the expected behavior or outcome
      expect(result).toBe('jwtToken');
      expect(fuseSDK._jwtToken).toBe('jwtToken');
    });

    // Add more test cases to cover different scenarios and edge cases
  });
});
