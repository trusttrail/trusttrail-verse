
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe, AlertTriangle, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NetworkSelectorProps {
  currentNetwork: string;
  onChange: (network: string) => void;
}

const NetworkSelector = ({ currentNetwork, onChange }: NetworkSelectorProps) => {
  const { toast } = useToast();
  const [actualNetwork, setActualNetwork] = useState<string>("amoy");

  // Network options for display
  const networks = [
    { id: "ethereum", name: "Ethereum Mainnet", icon: "⟠", supported: false },
    { id: "polygon", name: "Polygon Mainnet", icon: "🟣", supported: false },
    { id: "amoy", name: "Polygon Amoy (Testnet)", icon: "🟣", supported: true },
    { id: "ethSepolia", name: "Ethereum Sepolia (Testnet)", icon: "⟠", supported: true },
    { id: "opSepolia", name: "OP Sepolia (Testnet)", icon: "🔴", supported: true },
    { id: "arbitrum", name: "Arbitrum One", icon: "🔵", supported: false },
    { id: "optimism", name: "Optimism", icon: "🔴", supported: false },
    { id: "base", name: "Base", icon: "🔵", supported: false },
  ];

  // Listen for supported testnets
  useEffect(() => {
    const supportedNetworks = {
      '0x13882': 'amoy',        // Polygon Amoy
      '0xaa36a7': 'ethSepolia', // Ethereum Sepolia
      '0xaa37dc': 'opSepolia'   // OP Sepolia  
    };
    
    const checkNetwork = async () => {
      if (window.ethereum) {
        try {
          const chainId = await window.ethereum.request({ method: 'eth_chainId' });
          console.log('Current chain ID:', chainId);
          const networkId = supportedNetworks[chainId];
          if (networkId) {
            setActualNetwork(networkId);
          } else {
            setActualNetwork("wrong");
          }
        } catch (error) {
          console.error("Error checking network:", error);
          setActualNetwork("wrong");
        }
      }
    };
    
    checkNetwork();
    
    if (window.ethereum) {
      const handleChainChanged = (chainId: string) => {
        console.log('Chain changed to:', chainId);
        const networkId = supportedNetworks[chainId];
        if (networkId) {
          setActualNetwork(networkId);
          const networkName = networks.find(n => n.id === networkId)?.name || networkId;
          toast({
            title: "Network Changed",
            description: `Connected to ${networkName}`,
          });
        } else {
          setActualNetwork("wrong");
          toast({
            title: "Wrong Network", 
            description: "Please switch to a supported testnet (Polygon Amoy, Ethereum Sepolia, or OP Sepolia)",
            variant: "destructive",
          });
        }
      };
      
      window.ethereum.on('chainChanged', handleChainChanged);
      return () => {
        window.ethereum?.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [toast]);
  
  const handleNetworkSelect = async (networkId: string, supported: boolean) => {
    if (!supported) {
      toast({
        title: "Network Not Supported",
        description: `Currently only Polygon Amoy, Ethereum Sepolia, and OP Sepolia testnets are supported.`,
        variant: "destructive",
      });
      return;
    }
    
    if (window.ethereum) {
      const networkConfigs = {
        amoy: {
          chainId: '0x13882',
          chainName: 'Polygon Amoy Testnet',
          nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
          rpcUrls: ['https://rpc-amoy.polygon.technology/'],
          blockExplorerUrls: ['https://amoy.polygonscan.com/']
        },
        ethSepolia: {
          chainId: '0xaa36a7',
          chainName: 'Ethereum Sepolia Testnet',
          nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
          rpcUrls: ['https://sepolia.infura.io/v3/'],
          blockExplorerUrls: ['https://sepolia.etherscan.io/']
        },
        opSepolia: {
          chainId: '0xaa37dc',
          chainName: 'OP Sepolia Testnet', 
          nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
          rpcUrls: ['https://sepolia.optimism.io'],
          blockExplorerUrls: ['https://sepolia-optimism.etherscan.io/']
        }
      };

      const config = networkConfigs[networkId as keyof typeof networkConfigs];
      if (!config) return;

      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: config.chainId }],
        });
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [config]
            });
          } catch (addError) {
            console.error('Failed to add network:', addError);
            toast({
              title: "Failed to Add Network",
              description: `Could not add ${config.chainName} to MetaMask`,
              variant: "destructive",
            });
          }
        } else {
          console.error('Failed to switch network:', switchError);
          toast({
            title: "Failed to Switch Network",
            description: `Could not switch to ${config.chainName}`,
            variant: "destructive",
          });
        }
      }
    }
    
    onChange(networkId);
  };

  const supportedNetworkIds = ["amoy", "ethSepolia", "opSepolia"];
  const isWrongNetwork = !supportedNetworkIds.includes(actualNetwork);
  const selectedNetwork = networks.find(n => n.id === actualNetwork) || networks.find(n => n.id === "amoy") || networks[2];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={`flex items-center gap-2 ${isWrongNetwork ? 'border-destructive text-destructive' : ''}`}>
          {isWrongNetwork ? <AlertTriangle size={16} /> : <Globe size={16} />}
          <span className="hidden sm:inline">
            {isWrongNetwork ? "Wrong Network" : selectedNetwork.name}
          </span>
          <span className="sm:hidden">
            {isWrongNetwork ? "❌" : selectedNetwork.icon}
          </span>
          <ChevronDown size={14} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-popover border-border z-[200]">
        {isWrongNetwork && (
          <div className="px-3 py-2 text-sm text-destructive border-b border-border mb-1">
            Please switch to a supported testnet (Polygon Amoy, Ethereum Sepolia, or OP Sepolia)
          </div>
        )}
        {networks.map((network) => (
          <DropdownMenuItem
            key={network.id}
            className={`flex items-center gap-3 cursor-pointer ${
              actualNetwork === network.id && network.supported ? "bg-accent" : ""
            } ${!network.supported ? "opacity-60" : ""}`}
            onClick={() => handleNetworkSelect(network.id, network.supported)}
          >
            <span className="text-lg">{network.icon}</span>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{network.name}</span>
              {!network.supported && (
                <span className="text-xs text-muted-foreground">Coming Soon</span>
              )}
              {network.supported && actualNetwork === network.id && (
                <span className="text-xs text-green-600">Connected</span>
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NetworkSelector;
