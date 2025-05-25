
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Globe, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NetworkSelectorProps {
  currentNetwork: string;
  onChange: (network: string) => void;
}

const NetworkSelector = ({ currentNetwork, onChange }: NetworkSelectorProps) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [actualNetwork, setActualNetwork] = useState<string>("polygon");
  
  const networks = [
    { id: "polygon", name: "Polygon", icon: "🟣", supported: true },
    { id: "ethereum", name: "Ethereum", icon: "🔷", supported: false },
    { id: "arbitrum", name: "Arbitrum", icon: "🔵", supported: false },
    { id: "optimism", name: "Optimism", icon: "🔴", supported: false },
    { id: "base", name: "Base", icon: "🔘", supported: false }
  ];

  // Check current network from MetaMask
  useEffect(() => {
    const checkNetwork = async () => {
      if (window.ethereum) {
        try {
          const chainId = await window.ethereum.request({ method: 'eth_chainId' });
          // Polygon Mainnet: 0x89, for demo we'll assume other chains for wrong network display
          if (chainId === '0x89') {
            setActualNetwork("polygon");
          } else {
            // For demo, we'll show ethereum for other networks
            setActualNetwork("ethereum");
          }
        } catch (error) {
          console.error("Error checking network:", error);
        }
      }
    };

    checkNetwork();

    // Listen for network changes
    if (window.ethereum) {
      const handleChainChanged = (chainId: string) => {
        if (chainId === '0x89') {
          setActualNetwork("polygon");
        } else {
          setActualNetwork("ethereum");
        }
      };

      window.ethereum.on('chainChanged', handleChainChanged);
      return () => {
        if (window.ethereum) {
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, []);
  
  const handleNetworkSelect = (networkId: string, supported: boolean) => {
    if (!supported) {
      toast({
        title: "Network Not Supported",
        description: `${networkId.charAt(0).toUpperCase() + networkId.slice(1)} network is not supported yet. Please switch to Polygon.`,
        variant: "destructive",
      });
      return;
    }
    
    onChange(networkId);
    setIsOpen(false);
  };

  const getCurrentNetworkDetails = () => {
    return networks.find(network => network.id === actualNetwork);
  };

  const currentNetworkDetails = getCurrentNetworkDetails();
  const isWrongNetwork = actualNetwork !== "polygon";

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className={`flex items-center gap-2 ${isWrongNetwork ? 'border-red-500 text-red-400' : ''}`}>
          {isWrongNetwork ? <AlertTriangle size={16} /> : <Globe size={16} />}
          <span className="hidden sm:inline">
            {isWrongNetwork ? "Wrong Network" : `${currentNetworkDetails?.icon} ${currentNetworkDetails?.name}`}
          </span>
          <span className="sm:hidden">
            {isWrongNetwork ? "❌" : currentNetworkDetails?.icon}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-0">
        <div className="py-1">
          {isWrongNetwork && (
            <div className="px-3 py-2 text-sm text-red-400 border-b border-border">
              Please switch to Polygon network in MetaMask
            </div>
          )}
          {networks.map(network => (
            <button
              key={network.id}
              className={`w-full px-3 py-2 text-left flex items-center hover:bg-muted ${
                actualNetwork === network.id ? "bg-muted" : ""
              }`}
              onClick={() => handleNetworkSelect(network.id, network.supported)}
            >
              <span className="mr-2">{network.icon}</span>
              <span>{network.name}</span>
              {!network.supported && (
                <span className="ml-auto text-xs text-muted-foreground">Soon</span>
              )}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NetworkSelector;
