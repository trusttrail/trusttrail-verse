const hre = require("hardhat");

async function main() {
  console.log("Deploying TokenSwap contract...");

  // Deploy TokenSwap contract
  const TokenSwap = await hre.ethers.getContractFactory("TokenSwap");
  const tokenSwap = await TokenSwap.deploy();

  await tokenSwap.waitForDeployment();

  const swapAddress = await tokenSwap.getAddress();
  console.log("TokenSwap deployed to:", swapAddress);

  // Add supported tokens
  console.log("Adding supported tokens...");
  
  const tokens = [
    { address: "0x360ad4f9a9A8EFe9A8DCB5f461c4Cc1047E1Dcf9", symbol: "ETH" },
    { address: "0x85E44420b6137bbc75a85CAB5c9A3371af976FdE", symbol: "BTC" },
    { address: "0x2c852e740B62308c46DD29B982FBb650D063Bd07", symbol: "USDT" },
    { address: "0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582", symbol: "USDC" },
    { address: "0x186389f359713852366b4eA1eb9BC947f68F74ca", symbol: "TRUST" }
  ];

  for (const token of tokens) {
    try {
      const tx = await tokenSwap.addToken(token.address, token.symbol);
      await tx.wait();
      console.log(`Added token: ${token.symbol} at ${token.address}`);
    } catch (error) {
      console.error(`Failed to add token ${token.symbol}:`, error.message);
    }
  }

  console.log("\n=== Contract Addresses ===");
  console.log("TokenSwap:", swapAddress);
  console.log("\nUpdate the SWAP_CONTRACT_ADDRESS in src/hooks/useSwapTransaction.tsx to:", swapAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});