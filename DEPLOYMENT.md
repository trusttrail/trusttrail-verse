
# TrustTrail Smart Contract Deployment Guide

## Prerequisites

1. **Node.js** (v16 or higher)
2. **MetaMask wallet** with some MATIC tokens
3. **Polygonscan API key** (optional, for contract verification)

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

3. **Configure .env file:**
   - Add your private key (without 0x prefix)
   - Add Polygonscan API key (optional)
   - Update RPC URLs if using custom providers

## Deployment Steps

### 1. Deploy to Amoy Testnet

```bash
# Deploy contracts
npx hardhat run scripts/deploy.cjs --network amoy

# Verify contracts (optional)
npx hardhat run scripts/verify.cjs deployments/amoy-[timestamp].json
```

### 2. Test Integration

```bash
# Update contract addresses in scripts/test-integration.cjs
# Then run integration tests
npx hardhat run scripts/test-integration.cjs --network amoy
```

### 3. Deploy to Polygon Mainnet (Production)

```bash
# Deploy contracts
npx hardhat run scripts/deploy.cjs --network polygon

# Verify contracts
npx hardhat run scripts/verify.cjs deployments/polygon-[timestamp].json
```

## Verification

After deployment, you can verify your contracts on Polygonscan:

```bash
# For Amoy
npx hardhat verify --network amoy CONTRACT_ADDRESS "CONSTRUCTOR_ARG1" "CONSTRUCTOR_ARG2"

# For Polygon
npx hardhat verify --network polygon CONTRACT_ADDRESS "CONSTRUCTOR_ARG1" "CONSTRUCTOR_ARG2"
```

## Testing Your Deployment

1. **Check contract addresses** in the deployment JSON file
2. **Run integration tests** to verify functionality
3. **Test frontend integration** with the new contract addresses
4. **Submit a test review** through the UI
5. **Verify token rewards** are distributed correctly

## Troubleshooting

### Common Issues

1. **Insufficient MATIC:** Ensure your wallet has enough MATIC for gas fees
2. **RPC Rate Limits:** Use Alchemy/Infura for better reliability
3. **Verification Fails:** Wait a few minutes after deployment before verifying

### Gas Optimization

- Review submission: ~200,000 gas
- Review approval: ~100,000 gas  
- Upvote/Downvote: ~80,000 gas
- Token transfer: ~50,000 gas

## Frontend Integration

After successful deployment:

1. Contract addresses are automatically updated in `src/services/web3Service.ts`
2. ABIs are generated in `artifacts/` directory
3. Update `src/contracts/abis/` with the generated ABIs
4. Test the Web3 integration in your React app

## Security Notes

- Never commit your private key to version control
- Use hardware wallets for mainnet deployments
- Test thoroughly on Amoy before mainnet deployment
- Consider using multi-sig wallets for admin functions
