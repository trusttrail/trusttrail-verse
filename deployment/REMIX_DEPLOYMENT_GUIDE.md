# TrustTrail Token Deployment Guide for Remix IDE

## Prerequisites
1. **MetaMask** wallet installed and configured
2. **Polygon Amoy Testnet** added to MetaMask:
   - Network Name: `Polygon Amoy Testnet`
   - RPC URL: `https://rpc-amoy.polygon.technology/`
   - Chain ID: `80002`
   - Currency Symbol: `MATIC`
   - Block Explorer: `https://amoy.polygonscan.com/`

3. **Test MATIC** tokens for gas fees:
   - Get free MATIC from: https://faucet.polygon.technology/
   - Select "Polygon Amoy" network and paste your wallet address

## Deployment Steps

### Step 1: Open Remix IDE
1. Go to [remix.ethereum.org](https://remix.ethereum.org)
2. Create a new file: `TrustTrailToken.sol`
3. Copy the entire contract code from `deployment/TrustTrailToken-Amoy.sol`

### Step 2: Compile the Contract
1. Go to the "Solidity Compiler" tab (second icon on the left)
2. Select compiler version: `0.8.20`
3. Click "Compile TrustTrailToken.sol"
4. Ensure there are no errors

### Step 3: Deploy the Contract
1. Go to the "Deploy & Run Transactions" tab (third icon)
2. Environment: Select "Injected Provider - MetaMask"
3. Make sure MetaMask is connected to **Polygon Amoy Testnet**
4. Account: Your wallet address should appear
5. Contract: Select "TrustTrailToken"
6. Click **"Deploy"**
7. Confirm the transaction in MetaMask

### Step 4: Verify Deployment
After successful deployment:
1. **Copy the contract address** from the deployment log
2. The contract will have **1 billion TRT tokens** minted to your address
3. You can verify on Amoy PolygonScan: `https://amoy.polygonscan.com/address/[CONTRACT_ADDRESS]`

### Step 5: Test Basic Functions
In Remix, expand your deployed contract and test:
1. `name()` - Should return "TrustTrail Token"
2. `symbol()` - Should return "TRT"
3. `totalSupply()` - Should return "1000000000000000000000000000" (1B * 10^18)
4. `balanceOf([YOUR_ADDRESS])` - Should show your full balance

## Important Notes
- **Save the contract address** - you'll need to update it in your frontend
- The deployer (your address) will own all 1 billion tokens initially
- You can transfer tokens to users or set up minters for automated rewards
- Consider transferring some tokens to a multi-sig wallet for security

## Next Steps
Once deployed, share the contract address to update the frontend configuration in:
- `src/constants/network.ts` (update the `amoy.REWARD_TOKEN` address)