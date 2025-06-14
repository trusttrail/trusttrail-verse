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
  const [actualNetwork, setActualNetwork] = useState<string>("amoy");

  // Only support Polygon Amoy network now
  const networks = [
    { id: "amoy", name: "Polygon Amoy", icon: "🟣", supported: true }
  ];

  // Listen for "amoy" (Polygon Amoy testnet) chainId: 80002 / 0x13882
  useEffect(() => {
    const desiredChainId = '0x13882'; // Polygon Amoy
    const checkNetwork = async () => {
      if (window.ethereum) {
        try {
          const chainId = await window.ethereum.request({ method: 'eth_chainId' });
          if (chainId === desiredChainId) {
            setActualNetwork("amoy");
          } else {
            setActualNetwork("wrong");
          }
        } catch (error) {
          console.error("Error checking network:", error);
        }
      }
    };
    checkNetwork();
    if (window.ethereum) {
      const handleChainChanged = (chainId: string) => {
        if (chainId === desiredChainId) setActualNetwork("amoy");
        else setActualNetwork("wrong");
      };
      window.ethereum.on('chainChanged', handleChainChanged);
      return () => {
        window.ethereum?.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);
  
  const handleNetworkSelect = (networkId: string, supported: boolean) => {
    if (!supported) {
      toast({
        title: "Network Not Supported",
        description: `Currently only Polygon Amoy Testnet is supported.`,
        variant: "destructive",
      });
      return;
    }
    onChange(networkId);
    setIsOpen(false);
  };

  const isWrongNetwork = actualNetwork !== "amoy";

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className={`flex items-center gap-2 ${isWrongNetwork ? 'border-red-500 text-red-400' : ''}`}>
          {isWrongNetwork ? <AlertTriangle size={16} /> : <Globe size={16} />}
          <span className="hidden sm:inline">
            {isWrongNetwork ? "Wrong Network" : `🟣 Polygon Amoy`}
          </span>
          <span className="sm:hidden">
            {isWrongNetwork ? "❌" : "🟣"}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-0">
        <div className="py-1">
          {isWrongNetwork && (
            <div className="px-3 py-2 text-sm text-red-400 border-b border-border">
              Please switch to Polygon Amoy Testnet in MetaMask
            </div>
          )}
          <button
            key="amoy"
            className={`w-full px-3 py-2 text-left flex items-center hover:bg-muted ${
              actualNetwork === "amoy" ? "bg-muted" : ""
            }`}
            onClick={() => handleNetworkSelect("amoy", true)}
          >
            <span className="mr-2">🟣</span>
            <span>Polygon Amoy</span>
            {/* Only network */}
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NetworkSelector;
