
import { useEffect, useCallback } from "react";
import { AMOY_CHAIN_ID, AMOY_NETWORK_NAME } from "@/constants/network";
import { useToast } from "@/hooks/use-toast";

export const useWalletNetwork = (
  walletAddress: string,
  setIsWalletConnected: (val: boolean) => void,
  setCurrentNetwork: (val: string) => void,
  toast: any,
  setWalletAddress: (val: string) => void,
) => {
  useEffect(() => {
    if (!window.ethereum) return;
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        setIsWalletConnected(false);
        setWalletAddress("");
        setCurrentNetwork("");
        toast({
          title: "Wallet Disconnected",
          description: "Your wallet has been disconnected.",
        });
      } else {
        setWalletAddress(accounts[0]);
        toast({
          title: "Account Changed",
          description: `Connected to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
        });
      }
    };

    const handleChainChanged = (chainId: string) => {
      if (chainId !== AMOY_CHAIN_ID) {
        setIsWalletConnected(false);
        setCurrentNetwork("wrong");
        toast({
          title: "Wrong Network",
          description: `Wallet disconnected. Please switch to ${AMOY_NETWORK_NAME} and reconnect.`,
          variant: "destructive",
        });
      } else {
        setIsWalletConnected(true);
        setCurrentNetwork("amoy");
        toast({
          title: "Network Changed",
          description: `Connected to ${AMOY_NETWORK_NAME}.`,
        });
      }
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);
    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    };
    // eslint-disable-next-line
  }, [walletAddress, toast]);
};
