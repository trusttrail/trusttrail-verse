// Deployment script for Remix IDE
// Copy this into Remix and run it in the JavaScript VM or connected to OP Sepolia

const deployContracts = async () => {
  try {
    console.log("Starting deployment...");
    
    // Get the contract factories
    const TokenContract = await ethers.getContractFactory("TrustTrailToken");
    const ReviewsContract = await ethers.getContractFactory("TrustTrailReviews");
    
    console.log("Deploying TrustTrailToken...");
    const token = await TokenContract.deploy();
    await token.deployed();
    console.log("TrustTrailToken deployed to:", token.address);
    
    console.log("Deploying TrustTrailReviews...");
    const reviews = await ReviewsContract.deploy(token.address);
    await reviews.deployed();
    console.log("TrustTrailReviews deployed to:", reviews.address);
    
    console.log("Setting up token permissions...");
    await token.addMinter(reviews.address);
    console.log("Reviews contract added as minter");
    
    console.log("Funding reviews contract...");
    const fundAmount = ethers.utils.parseEther("10000"); // 10,000 tokens
    await token.transfer(reviews.address, fundAmount);
    console.log("Transferred 10,000 tokens to reviews contract");
    
    console.log("\n=== DEPLOYMENT COMPLETE ===");
    console.log("TrustTrailToken:", token.address);
    console.log("TrustTrailReviews:", reviews.address);
    console.log("Network:", await ethers.provider.getNetwork());
    
    return {
      token: token.address,
      reviews: reviews.address
    };
    
  } catch (error) {
    console.error("Deployment failed:", error);
    throw error;
  }
};

// For Remix IDE
if (typeof ethers !== 'undefined') {
  deployContracts()
    .then((addresses) => {
      console.log("Update your frontend configuration with:");
      console.log(`TOKEN_ADDRESS: "${addresses.token}"`);
      console.log(`REVIEWS_ADDRESS: "${addresses.reviews}"`);
    })
    .catch(console.error);
}