const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Starting secure deployment...");
  
  // Validate that we have the required private key
  if (!process.env.PRIVATE_KEY) {
    console.error("❌ PRIVATE_KEY environment variable is required for deployment");
    console.log("Please set your private key as an environment variable:");
    console.log("export PRIVATE_KEY=your_private_key_here");
    process.exit(1);
  }
  
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "MATIC");

  // Deploy TrustTrailToken first
  console.log("\n1. Deploying TrustTrailToken...");
  const TrustTrailToken = await ethers.getContractFactory("TrustTrailToken");
  const token = await TrustTrailToken.deploy();
  await token.waitForDeployment();
  
  const tokenAddress = await token.getAddress();
  console.log("TrustTrailToken deployed to:", tokenAddress);

  // Deploy TrustTrailReviews with token address
  console.log("\n2. Deploying TrustTrailReviews...");
  const TrustTrailReviews = await ethers.getContractFactory("TrustTrailReviews");
  const reviews = await TrustTrailReviews.deploy(tokenAddress, deployer.address);
  await reviews.waitForDeployment();
  
  const reviewsAddress = await reviews.getAddress();
  console.log("TrustTrailReviews deployed to:", reviewsAddress);

  // Add reviews contract as minter for token rewards
  console.log("\n3. Setting up permissions...");
  const addMinterTx = await token.addMinter(reviewsAddress);
  await addMinterTx.wait();
  console.log("Added reviews contract as token minter");

  // Transfer some tokens to reviews contract for rewards
  const rewardAmount = ethers.parseEther("10000"); // 10k tokens for rewards
  const transferTx = await token.transfer(reviewsAddress, rewardAmount);
  await transferTx.wait();
  console.log("Transferred", ethers.formatEther(rewardAmount), "tokens to reviews contract");

  // Save deployment info securely
  const deploymentInfo = {
    network: hre.network.name,
    chainId: (await ethers.provider.getNetwork()).chainId.toString(),
    deployer: deployer.address,
    contracts: {
      TrustTrailToken: {
        address: tokenAddress,
        constructorArgs: [],
      },
      TrustTrailReviews: {
        address: reviewsAddress,
        constructorArgs: [tokenAddress, deployer.address],
      },
    },
    deploymentTime: new Date().toISOString(),
  };

  // Save to file
  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }
  
  const filename = `${hre.network.name}-${Date.now()}.json`;
  fs.writeFileSync(
    path.join(deploymentsDir, filename),
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log("\n=== SECURE DEPLOYMENT COMPLETE ===");
  console.log("Network:", hre.network.name);
  console.log("TrustTrailToken:", tokenAddress);
  console.log("TrustTrailReviews:", reviewsAddress);
  console.log("Deployment info saved to:", filename);
  
  // Update contract addresses in web3Service
  console.log("\n4. Updating contract addresses...");
  updateContractAddresses(hre.network.name, tokenAddress, reviewsAddress);
  
  console.log("\nNext steps:");
  console.log("1. Verify contracts on Polygonscan (optional)");
  console.log("2. Test contract interactions");
  console.log("3. Update frontend with new addresses");
  console.log("\n⚠️  SECURITY REMINDER:");
  console.log("- Keep your private keys secure and never commit them to version control");
  console.log("- Use environment variables or secure key management systems");
  console.log("- Regularly rotate your deployment keys");
}

function updateContractAddresses(network, tokenAddress, reviewsAddress) {
  const web3ServicePath = path.join(__dirname, "../src/services/web3Service.ts");
  
  if (!fs.existsSync(web3ServicePath)) {
    console.log("⚠️  web3Service.ts not found, skipping address update");
    return;
  }
  
  let content = fs.readFileSync(web3ServicePath, "utf8");
  
  if (network === "amoy") {
    content = content.replace(
      /amoy: {[\s\S]*?}/,
      `amoy: {
    reviewPlatform: '${reviewsAddress}',
    rewardToken: '${tokenAddress}',
    chainId: 80002,
    rpcUrl: 'https://rpc-amoy.polygon.technology/',
    explorerUrl: 'https://amoy.polygonscan.com/'
  }`
    );
  } else if (network === "polygon") {
    content = content.replace(
      /polygon: {[\s\S]*?}/,
      `polygon: {
    reviewPlatform: '${reviewsAddress}',
    rewardToken: '${tokenAddress}',
    chainId: 137,
    rpcUrl: 'https://polygon-rpc.com/',
    explorerUrl: 'https://polygonscan.com/'
  }`
    );
  }
  
  fs.writeFileSync(web3ServicePath, content);
  console.log("Updated contract addresses in web3Service.ts");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
