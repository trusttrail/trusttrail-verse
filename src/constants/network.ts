
// Network configurations
export const AMOY_CHAIN_ID = '0x13882'; // 80002 (Amoy Polygon Testnet)
export const AMOY_NETWORK_NAME = 'Polygon Amoy (Testnet)';

export const OP_SEPOLIA_CHAIN_ID = '0xaa36a7'; // 11155420 (OP Sepolia Testnet)
export const OP_SEPOLIA_NETWORK_NAME = 'OP Sepolia (Testnet)';

// Contract addresses by network
export const CONTRACT_ADDRESSES = {
  amoy: {
    REVIEW_PLATFORM: '0x3d27504B6B18Da549D6F18928c3fa8A35675aB8A',
    REWARD_TOKEN: '', // Add after token deployment
  },
  opSepolia: {
    REVIEW_PLATFORM: '', // Add after deployment on OP Sepolia
    REWARD_TOKEN: '', // Add after token deployment
  }
};

// Legacy export for backward compatibility
export const REVIEW_PLATFORM_ADDRESS = CONTRACT_ADDRESSES.amoy.REVIEW_PLATFORM;
