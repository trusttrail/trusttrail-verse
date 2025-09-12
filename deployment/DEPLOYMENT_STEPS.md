# OP Sepolia Deployment Instructions

## Prerequisites
- Remix IDE: https://remix.ethereum.org/
- MetaMask with OP Sepolia testnet configured
- Test ETH from OP Sepolia faucet: https://sepolia-optimism.etherscan.io/

## Deployment Steps

### 1. Configure OP Sepolia Network in MetaMask
- Network Name: OP Sepolia
- RPC URL: https://sepolia.optimism.io
- Chain ID: 11155420
- Currency Symbol: ETH
- Block Explorer: https://sepolia-optimism.etherscan.io/

### 2. Get Test ETH
Visit the OP Sepolia faucet and get test ETH for deployment.

### 3. Deploy TrustTrailToken Contract

1. Open Remix IDE
2. Create a new file: `TrustTrailToken.sol`
3. Copy and paste the contract code from `TrustTrailToken.sol`
4. Go to the "Solidity Compiler" tab
5. Set compiler version to 0.8.20
6. Compile the contract
7. Go to "Deploy & Run Transactions" tab
8. Select "Injected Provider - MetaMask" as environment
9. Ensure you're connected to OP Sepolia
10. Deploy the `TrustTrailToken` contract
11. **Save the deployed token contract address**

### 4. Deploy TrustTrailReviews Contract

1. Create a new file: `TrustTrailReviews.sol`
2. Copy and paste the contract code from `TrustTrailReviews.sol`
3. Compile the contract
4. In the deploy section, provide the token contract address from step 3
5. Deploy the `TrustTrailReviews` contract
6. **Save the deployed reviews contract address**

### 5. Configure Token Minting

After deployment, you need to configure the token contract:

1. In the deployed `TrustTrailToken` contract, call `addMinter`
2. Pass the `TrustTrailReviews` contract address as the minter
3. This allows the reviews contract to mint tokens as rewards

### 6. Fund the Reviews Contract

Transfer some tokens to the reviews contract so it can distribute rewards:

1. Call `transfer` on the token contract
2. Send tokens to the reviews contract address
3. Recommended: 10,000 TRUST tokens for initial rewards

## Contract Addresses (Update after deployment)

- **TrustTrailToken**: `YOUR_TOKEN_ADDRESS_HERE`
- **TrustTrailReviews**: `YOUR_REVIEWS_ADDRESS_HERE`

## Network Configuration

```javascript
// Add to your frontend configuration
const OP_SEPOLIA_CONFIG = {
  chainId: '0xaa36a7', // 11155420 in hex
  chainName: 'OP Sepolia',
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18
  },
  rpcUrls: ['https://sepolia.optimism.io'],
  blockExplorerUrls: ['https://sepolia-optimism.etherscan.io/']
};
```

## Verification (Optional)

To verify your contracts on Etherscan:

1. Go to https://sepolia-optimism.etherscan.io/
2. Find your contract address
3. Click "Contract" tab → "Verify and Publish"
4. Upload the contract source code
5. Set compiler version to 0.8.20
6. Add constructor arguments if needed