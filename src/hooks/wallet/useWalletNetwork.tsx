
import { useEffect } from "react";
import { AMOY_CHAIN_ID, AMOY_NETWORK_NAME, OP_SEPOLIA_CHAIN_ID, OP_SEPOLIA_NETWORK_NAME } from "@/constants/network";
import { useToast } from "@/hooks/use-toast";

export const useWalletNetwork = (
  walletAddress: string,
  setIsWalletConnected: (val: boolean) => void,
  setCurrentNetwork: (val: string) => void,
  setWalletAddress: (val: string) => void,
) => {
  const { toast } = useToast();

  useEffect(() => {
    if (!window.ethereum) return;

    const supportedNetworks = {
      [AMOY_CHAIN_ID]: { id: 'amoy', name: AMOY_NETWORK_NAME },
      [OP_SEPOLIA_CHAIN_ID]: { id: 'opSepolia', name: OP_SEPOLIA_NETWORK_NAME },
    };
    
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
      const network = supportedNetworks[chainId];
      if (network) {
        setIsWalletConnected(true);
        setCurrentNetwork(network.id);
        toast({
          title: "Network Changed",
          description: `Connected to ${network.name}.`,
        });
      } else {
        setIsWalletConnected(false);
        setCurrentNetwork("wrong");
        toast({
          title: "Wrong Network",
          description: `Wallet disconnected. Please switch to a supported testnet and reconnect.`,
          variant: "destructive",
        });
      }
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);
    
    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, [walletAddress, toast, setIsWalletConnected, setWalletAddress, setCurrentNetwork]);
};
