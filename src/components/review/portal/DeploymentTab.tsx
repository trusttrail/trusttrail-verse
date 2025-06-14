
import React from "react";
import DeploymentTester from "@/components/blockchain/DeploymentTester";

const DeploymentTab = () => (
  <>
    <div className="mb-4 text-foreground/70 text-sm border border-border rounded bg-muted/40 p-3">
      <strong>What is Deploy & Test?</strong> <br />
      Use this area to deploy mock smart contracts and test blockchain features. Perfect for verifying functionality on Polygon Amoy testnet before going live!
    </div>
    <DeploymentTester />
  </>
);

export default DeploymentTab;
