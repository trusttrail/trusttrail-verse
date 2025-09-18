# TrustTrail Unified Contract Deployment Guide for Remix IDE

## 🚀 NEW UNIFIED CONTRACT
This contract combines BOTH the TRST token functionality AND the review platform in a single contract.
- ✅ 1 Billion TRST tokens
- ✅ Review submission & approval
- ✅ Staking & rewards system  
- ✅ Voting & reputation system

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
2. Create a new file: `TrustTrailReviews.sol`
3. Copy the entire contract code from `deployment/TrustTrailReviews-Unified.sol`

### Step 2: Compile the Contract
1. Go to the "Solidity Compiler" tab (second icon on the left)
2. Select compiler version: `0.8.20`
3. Click "Compile TrustTrailReviews.sol"
4. Ensure there are no errors

### Step 3: Deploy the Contract
1. Go to the "Deploy & Run Transactions" tab (third icon)
2. Environment: Select "Injected Provider - MetaMask"
3. Make sure MetaMask is connected to **Polygon Amoy Testnet**
4. Account: Your wallet address should appear
5. Contract: Select "TrustTrailReviews"
6. Click **"Deploy"**
7. Confirm the transaction in MetaMask (may require higher gas limit)

### Step 4: Verify Deployment
After successful deployment:
1. **Copy the contract address** from the deployment log
2. The contract will have:
   - **1 billion TRST tokens** minted to your address
   - **Review submission functionality**
   - **Staking system ready**
   - **Reward distribution system**
3. You can verify on Amoy PolygonScan: `https://amoy.polygonscan.com/address/[CONTRACT_ADDRESS]`

### Step 5: Test Contract Functions
In Remix, expand your deployed contract and test:

**Token Functions:**
1. `name()` - Should return "TrustTrail Token"
2. `symbol()` - Should return "TRST"
3. `totalSupply()` - Should return "1000000000000000000000000000" (1B * 10^18)
4. `balanceOf([YOUR_ADDRESS])` - Should show your full balance

**Review Platform Functions:**
1. `submitReview()` - Test submitting a review
2. `reviewRewardAmount()` - Should show "10000000000000000000" (10 TRST)
3. `upvoteRewardAmount()` - Should show "1000000000000000000" (1 TRST)

**Staking Functions:**
1. `stakeTokens()` - Test staking some tokens
2. `getStakedBalance([YOUR_ADDRESS])` - Check staked balance
3. `calculateRewards([YOUR_ADDRESS])` - Check pending rewards

## Important Notes
- **Save the contract address** - you'll need to update it in your frontend
- The deployer (your address) will own all 1 billion tokens initially
- The contract includes admin functions for review moderation
- Users can stake tokens and earn 30% APY rewards
- Review submissions automatically reward 10 TRST tokens when approved
- Upvotes reward 1 TRST token to the original reviewer

## Next Steps
Once deployed, share the contract address to update the frontend configuration in:
- `src/constants/network.ts` (update BOTH `amoy.REVIEW_PLATFORM` and `amoy.REWARD_TOKEN` to the same new address)

## Contract Features Summary
🔹 **ERC20 Token**: Full TRST token with 1B supply  
🔹 **Review System**: Submit, approve, vote on reviews  
🔹 **Staking System**: Stake TRST tokens for 30% APY  
🔹 **Reward System**: Automatic token rewards for quality reviews  
🔹 **Admin Controls**: Moderation, pausing, emergency functions  
🔹 **Security**: Access controls, reentrancy protection, pausable