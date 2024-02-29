// src/utils/auth.test.ts

import { ethers } from 'ethers';
import { AuthDto } from '../types/auth/auth.dto';
import { EOASigner } from 'userop';
import { SmartWalletAuth } from './auth';

describe('SmartWalletAuth', () => {
  describe('signer', () => {
    it('should authenticate the user using the provided credentials', async () => {
      // Create an instance of EOASigner with mock data
      const credentials: EOASigner = {
        getAddress: jest.fn().mockResolvedValue('ownerAddress'),
        signMessage: jest.fn().mockResolvedValue('signature'),
      };

      // Call the signer method with the mock credentials
      const result = await SmartWalletAuth.signer(credentials, 'smartWalletAddress');

      // Assert the expected behavior or outcome
      expect(result).toBeInstanceOf(AuthDto);
      expect(result.ownerAddress).toBe('ownerAddress');
      expect(result.signature).toBe('signature');
      expect(result.hash).toBeDefined();
      expect(result.smartWalletAddress).toBe('smartWalletAddress');
    });

    // Add more test cases to cover different scenarios and edge cases
  });
});
