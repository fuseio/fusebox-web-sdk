## [0.3.9]

### Changed
- Updated `TimeFrame` enum:
  - Removed: `hour`, `day`, and `all` values
  - Added: `year` value

### Breaking Changes
- The removal of `hour`, `day`, and `all` from the `TimeFrame` enum may affect existing code that relies on these values.

## [0.3.8]

### Fixed
- Fixed the `getTokenList` method.

## [0.3.6]

### Added
- Introduced a new module, `BalancesModule`, for interacting with the Fuse Balances API.

## [0.3.3]

### Changed
- **Breaking Change:** Updated the `swapTokens` method to retrieve quotes through the new API, utilizing Voltage V3, the latest router contract. It now gets `TradeRequest` instead of `TradeRequestBody`, the amount of tokens to swap is now a `BigInt` instead of a `String`.
