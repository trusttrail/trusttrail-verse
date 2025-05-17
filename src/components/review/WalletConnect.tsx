
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Wallet, ExternalLink, Copy, Check, Unlink, PlugZap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface WalletConnectProps {
  isConnected: boolean;
  address: string;
  onConnect: () => void;
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
  const [showWalletDialog, setShowWalletDialog] = useState(false);
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
    onDisconnect();
    setIsOpen(false);
    
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected successfully",
    });
  };

  const handleConnectClick = () => {
    if (isMetaMaskAvailable) {
      onConnect();
    } else {
      setShowWalletDialog(true);
    }
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
              asChild
            >
              <a href={`https://polygonscan.com/address/${address}`} target="_blank" rel="noopener noreferrer">
                View on Explorer
                <ExternalLink size={14} />
              </a>
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
      
      {/* Wallet Connection Options Dialog */}
      <Dialog open={showWalletDialog} onOpenChange={setShowWalletDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Connect your wallet</DialogTitle>
            <DialogDescription>
              Choose a method to connect your crypto wallet
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <Button 
              variant="outline" 
              className="flex items-center justify-between w-full p-4 h-auto" 
              onClick={() => {
                window.open("https://metamask.io/download/", "_blank");
              }}
            >
              <div className="flex items-center">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" 
                  alt="MetaMask" 
                  className="w-8 h-8 mr-3" 
                />
                <div className="text-left">
                  <h3 className="font-medium">MetaMask</h3>
                  <p className="text-xs text-muted-foreground">Install the extension</p>
                </div>
              </div>
              <ExternalLink size={16} />
            </Button>
            
            <Button 
              variant="outline"
              className="flex items-center justify-between w-full p-4 h-auto"
              onClick={() => {
                setShowWalletDialog(false);
                if (onWalletConnectClick) onWalletConnectClick();
              }}
            >
              <div className="flex items-center">
                <img 
                  src="https://trusttrail.com/walletconnect-logo.png" 
                  alt="WalletConnect" 
                  className="w-8 h-8 mr-3"
                  onError={(e) => {
                    e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI5NiIgaGVpZ2h0PSI5NiIgdmlld0JveD0iMCAwIDk2IDk2Ij48Y2lyY2xlIGN4PSI0OCIgY3k9IjQ4IiByPSI0OCIgZmlsbD0iIzNiOTlmYyIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0zMC4zIDQ2LjNjOS43LTkuNSAyNS41LTkuNSAzNS4yIDBsMS4yIDEuMmMyLjkgMi44IDIuOSA3LjMgMCAxMC4xLS4zLjMtLjYuNi0uOS44bC0xLjMgMS4zYy0yLjMgMi4zLTYuMSAyLjMtOC40IDBsLTEuMy0xLjNjLTQuMy00LjItMTEuMy00LjItMTUuNiAwbC0xLjMgMS4zYy0yLjMgMi4zLTYuMSAyLjMtOC40IDBsLTEuMy0xLjNjLS4zLS4zLS42LS41LS45LS44LTIuOS0yLjgtMi45LTcuMyAwLTEwLjFsMS4yLTEuMnoiLz48L3N2Zz4=";
                  }}
                />
                <div className="text-left">
                  <h3 className="font-medium">WalletConnect</h3>
                  <p className="text-xs text-muted-foreground">Use your mobile wallet app</p>
                </div>
              </div>
              <PlugZap size={16} />
            </Button>
          </div>
          
          <DialogFooter>
            <Button 
              variant="ghost" 
              onClick={() => setShowWalletDialog(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WalletConnect;
