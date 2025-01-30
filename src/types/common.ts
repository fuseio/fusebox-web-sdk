import { EOASigner } from "userop";
import { Owner } from "./pimlico";

// Type guard to check if credentials are of type EOASigner
export function isEOASigner(credentials: EOASigner | Owner): credentials is EOASigner {
  return typeof (credentials as EOASigner).getAddress === 'function'
}
