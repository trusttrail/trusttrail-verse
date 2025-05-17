
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NetworkSelectorProps {
  currentNetwork: string;
  onChange: (network: string) => void;
}

const NetworkSelector = ({ currentNetwork, onChange }: NetworkSelectorProps) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  
  const networks = [
    { id: "polygon", name: "Polygon", icon: "🟣", supported: true },
    { id: "ethereum", name: "Ethereum", icon: "🔷", supported: false },
    { id: "arbitrum", name: "Arbitrum", icon: "🔵", supported: false },
    { id: "optimism", name: "Optimism", icon: "🔴", supported: false },
    { id: "base", name: "Base", icon: "🔘", supported: false }
  ];
  
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
    return networks.find(network => network.id === currentNetwork);
  };

  const currentNetworkDetails = getCurrentNetworkDetails();

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Globe size={16} />
          <span className="hidden sm:inline">
            {currentNetworkDetails?.icon} {currentNetworkDetails?.name}
          </span>
          <span className="sm:hidden">{currentNetworkDetails?.icon}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-0">
        <div className="py-1">
          {networks.map(network => (
            <button
              key={network.id}
              className={`w-full px-3 py-2 text-left flex items-center hover:bg-muted ${
                currentNetwork === network.id ? "bg-muted" : ""
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
