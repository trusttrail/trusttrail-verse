
const { run } = require("hardhat");

async function main() {
  const deploymentFile = process.argv[2];
  if (!deploymentFile) {
    console.error("Please provide deployment file path");
    process.exit(1);
  }

  const deployment = require(deploymentFile);
  
  console.log("Verifying contracts on", deployment.network);
  
  try {
    // Verify Token
    console.log("Verifying TrustTrailToken...");
    await run("verify:verify", {
      address: deployment.contracts.TrustTrailToken.address,
      constructorArguments: deployment.contracts.TrustTrailToken.constructorArgs,
    });
    
    // Verify Reviews
    console.log("Verifying TrustTrailReviews...");
    await run("verify:verify", {
      address: deployment.contracts.TrustTrailReviews.address,
      constructorArguments: deployment.contracts.TrustTrailReviews.constructorArgs,
    });
    
    console.log("Verification complete!");
  } catch (error) {
    console.error("Verification failed:", error);
  }
}

main().catch(console.error);
