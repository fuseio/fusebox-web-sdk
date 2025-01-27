import { EOASigner } from "userop";
import { Account } from "viem";

// Type guard to check if credentials are of type EOASigner
export function isEOASigner(credentials: EOASigner | Account): credentials is EOASigner {
  return typeof (credentials as EOASigner).getAddress === 'function'
}
