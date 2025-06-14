
const { ethers } = require("hardhat");

async function main() {
  console.log("Testing contract integration...");
  
  const [deployer, user1, user2] = await ethers.getSigners();
  
  // Get deployed contracts (you'll need to update these addresses after deployment)
  const tokenAddress = "0x0000000000000000000000000000000000000000"; // Update after deployment
  const reviewsAddress = "0x0000000000000000000000000000000000000000"; // Update after deployment
  
  if (tokenAddress === "0x0000000000000000000000000000000000000000") {
    console.log("Please update contract addresses in test-integration.cjs after deployment");
    return;
  }
  
  const token = await ethers.getContractAt("TrustTrailToken", tokenAddress);
  const reviews = await ethers.getContractAt("TrustTrailReviews", reviewsAddress);
  
  console.log("\n=== Testing Token Contract ===");
  const totalSupply = await token.totalSupply();
  console.log("Total Supply:", ethers.formatEther(totalSupply), "TRUST");
  
  const deployerBalance = await token.balanceOf(deployer.address);
  console.log("Deployer Balance:", ethers.formatEther(deployerBalance), "TRUST");
  
  console.log("\n=== Testing Review Submission ===");
  
  // Submit a test review
  const reviewTx = await reviews.connect(user1).submitReview(
    "Test Company",
    "Technology",
    "QmTestIPFSHash123", // Mock IPFS hash
    "QmTestProofHash456", // Mock proof IPFS hash
    5 // 5-star rating
  );
  
  const receipt = await reviewTx.wait();
  console.log("Review submitted! Gas used:", receipt.gasUsed.toString());
  
  // Get the review
  const review = await reviews.getReview(1);
  console.log("Review details:", {
    reviewer: review.reviewer,
    company: review.companyName,
    rating: review.rating.toString(),
    status: review.status.toString()
  });
  
  console.log("\n=== Testing Review Approval (Admin) ===");
  
  // Approve the review (as admin/deployer)
  const approveTx = await reviews.connect(deployer).approveReview(1);
  await approveTx.wait();
  console.log("Review approved!");
  
  // Check user1's token balance (should have received reward)
  const user1Balance = await token.balanceOf(user1.address);
  console.log("User1 balance after approval:", ethers.formatEther(user1Balance), "TRUST");
  
  console.log("\n=== Testing Review Voting ===");
  
  // User2 upvotes the review
  const upvoteTx = await reviews.connect(user2).upvoteReview(1);
  await upvoteTx.wait();
  console.log("Review upvoted!");
  
  // Check updated review stats
  const updatedReview = await reviews.getReview(1);
  console.log("Updated review stats:", {
    upvotes: updatedReview.upvotes.toString(),
    downvotes: updatedReview.downvotes.toString()
  });
  
  // Check user1's balance again (should have received upvote reward)
  const user1FinalBalance = await token.balanceOf(user1.address);
  console.log("User1 final balance:", ethers.formatEther(user1FinalBalance), "TRUST");
  
  console.log("\n=== Integration Test Complete ===");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
