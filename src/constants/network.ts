
// Network configurations
export const AMOY_CHAIN_ID = '0x13882'; // 80002 (Amoy Polygon Testnet)
export const AMOY_NETWORK_NAME = 'Polygon Amoy (Testnet)';

export const ETH_SEPOLIA_CHAIN_ID = '0xaa36a7'; // 11155111 (Ethereum Sepolia Testnet)
export const ETH_SEPOLIA_NETWORK_NAME = 'Ethereum Sepolia (Testnet)';

export const OP_SEPOLIA_CHAIN_ID = '0xaa37dc'; // 11155420 (OP Sepolia Testnet)  
export const OP_SEPOLIA_NETWORK_NAME = 'OP Sepolia (Testnet)';

// Contract addresses by network
export const CONTRACT_ADDRESSES = {
  amoy: {
    REVIEW_PLATFORM: '0x7F2cB4F56CC15C6a9c92d16D62870b042DF50854', // Unified TrustTrailReviews contract
    REWARD_TOKEN: '0x7F2cB4F56CC15C6a9c92d16D62870b042DF50854', // Same unified contract for TRST tokens
  },
  ethSepolia: {
    REVIEW_PLATFORM: '0x1665691897705F7bA63C62067F189993A1d44AD5', // ETH Sepolia TrustTrail contract  
    REWARD_TOKEN: '0x1665691897705F7bA63C62067F189993A1d44AD5', // TRUST token contract
  },
  opSepolia: {
    REVIEW_PLATFORM: '0x4b5ab11f4a0be346473746420983e4ab40c9ac38', // OP Sepolia TrustTrail contract (lowercase to fix validation)
    REWARD_TOKEN: '0x4b5ab11f4a0be346473746420983e4ab40c9ac38', // TRUST token contract (lowercase to fix validation)
  }
};

// Legacy export for backward compatibility
export const REVIEW_PLATFORM_ADDRESS = CONTRACT_ADDRESSES.amoy.REVIEW_PLATFORM;
