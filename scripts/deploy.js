const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Starting deployment...");
  
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

  // Save deployment info
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
  
  console.log("\n=== DEPLOYMENT COMPLETE ===");
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
}

function updateContractAddresses(network, tokenAddress, reviewsAddress) {
  const web3ServicePath = path.join(__dirname, "../src/services/web3Service.ts");
  let content = fs.readFileSync(web3ServicePath, "utf8");
  
  if (network === "amoy") {
    content = content.replace(
      /mumbai: {[\s\S]*?}/,
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
    console.error(error);
    process.exit(1);
  });
