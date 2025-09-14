
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Wallet, ExternalLink, Copy, Check, Unlink, PlugZap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { web3Service } from '@/services/web3Service';
import MultiWalletSelector from './MultiWalletSelector';
import { DetectedWallet } from '@/utils/walletProviders';

interface WalletConnectProps {
  isConnected: boolean;
  address: string;
  onConnect: (wallet?: DetectedWallet) => void;
  onDisconnect: () => void;
  onWalletConnectClick?: () => void;
  isMetaMaskAvailable?: boolean;
  isWalletConnecting?: boolean;
}

const WalletConnect = ({ 
  isConnected, 
  address, 
  onConnect, 
  onDisconnect, 
  onWalletConnectClick,
  isMetaMaskAvailable = true, 
  isWalletConnecting = false 
}: WalletConnectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showWalletSelector, setShowWalletSelector] = useState(false);
  const { toast } = useToast();
  
  const shortenAddress = (addr: string) => {
    return addr ? `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}` : '';
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    toast({
      title: "Address Copied",
      description: "Wallet address copied to clipboard",
    });
  };
  
  const handleDisconnect = () => {
    console.log('🔌 Manual wallet disconnect triggered');
    
    // First close the popover to prevent any event bubbling issues
    setIsOpen(false);
    
    // Add a small delay to ensure popover state is updated
    setTimeout(() => {
      onDisconnect();
    }, 100);
  };

  const handleConnectClick = () => {
    setShowWalletSelector(true);
  };

  const handleWalletSelect = (wallet: DetectedWallet) => {
    setShowWalletSelector(false);
    onConnect(wallet);
  };

  // Get the correct explorer URL for current network
  const getExplorerUrl = async () => {
    const currentNetwork = await web3Service.getCurrentNetwork();
    const contracts = await web3Service.getContractAddresses();
    return `${contracts.explorerUrl}address/${address}`;
  };

  return isConnected ? (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Wallet size={16} />
          <span className="hidden sm:inline">{shortenAddress(address)}</span>
          <span className="sm:hidden">👛</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60 p-0">
        <div className="p-4">
          <div className="flex justify-between items-center mb-3">
            <p className="font-medium text-sm">Connected Wallet</p>
            <div className="bg-green-500/10 text-green-500 text-xs px-2 py-1 rounded-full">Connected</div>
          </div>
          
          <div className="bg-muted p-2 rounded-md flex items-center justify-between mb-3">
            <span className="text-sm">{shortenAddress(address)}</span>
            <button 
              onClick={handleCopy} 
              className="p-1 hover:bg-background rounded"
              aria-label="Copy address"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          
          <div className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-between" 
              size="sm"
              onClick={async () => {
                const url = await getExplorerUrl();
                window.open(url, '_blank', 'noopener noreferrer');
              }}
            >
              View on Explorer
              <ExternalLink size={14} />
            </Button>
            
            <Button 
              variant="destructive" 
              size="sm" 
              className="w-full" 
              onClick={handleDisconnect}
            >
              <Unlink size={14} className="mr-2" />
              Disconnect
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ) : (
    <>
      <Button 
        onClick={handleConnectClick}
        className="bg-gradient-to-r from-trustpurple-500 to-trustblue-500 hover:from-trustpurple-600 hover:to-trustblue-600"
        disabled={isWalletConnecting}
      >
        <Wallet size={16} className="mr-2" />
        <span className="hidden sm:inline">
          {isWalletConnecting ? "Connecting..." : "Connect Wallet"}
        </span>
        <span className="sm:hidden">
          {isWalletConnecting ? "..." : "Connect"}
        </span>
      </Button>
      
      {/* Multi-Wallet Selector */}
      <MultiWalletSelector
        isOpen={showWalletSelector}
        onClose={() => setShowWalletSelector(false)}
        onWalletSelect={handleWalletSelect}
        isConnecting={isWalletConnecting}
      />
    </>
  );
};

export default WalletConnect;
