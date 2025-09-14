import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ExternalLink, Wallet, Download } from "lucide-react";
import { detectWallets, DetectedWallet, WALLET_PROVIDERS } from '@/utils/walletProviders';
import { useToast } from '@/hooks/use-toast';

interface MultiWalletSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onWalletSelect: (wallet: DetectedWallet) => void;
  isConnecting: boolean;
}

const MultiWalletSelector = ({ 
  isOpen, 
  onClose, 
  onWalletSelect, 
  isConnecting 
}: MultiWalletSelectorProps) => {
  const [availableWallets, setAvailableWallets] = useState<DetectedWallet[]>([]);
  const [installedWallets, setInstalledWallets] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      const wallets = detectWallets();
      setAvailableWallets(wallets);
      setInstalledWallets(wallets.map(w => w.provider.id));
    }
  }, [isOpen]);

  const handleWalletClick = async (wallet: DetectedWallet) => {
    try {
      onWalletSelect(wallet);
    } catch (error) {
      console.error('Error selecting wallet:', error);
      toast({
        title: "Connection Error",
        description: `Failed to connect to ${wallet.provider.name}. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const handleInstallWallet = (provider: any) => {
    window.open(provider.downloadUrl, '_blank', 'noopener noreferrer');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet size={20} />
            Connect Your Wallet
          </DialogTitle>
          <DialogDescription>
            Choose from {availableWallets.length > 0 ? 'your installed wallets' : 'available wallet options'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 py-4">
          {availableWallets.length > 0 && (
            <>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Installed Wallets ({availableWallets.length})
              </h3>
              {availableWallets.map((wallet) => (
                <Card key={wallet.provider.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardContent className="p-4">
                    <Button
                      variant="ghost"
                      className="w-full h-auto p-0 justify-start"
                      onClick={() => handleWalletClick(wallet)}
                      disabled={isConnecting}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <img 
                          src={wallet.provider.icon}
                          alt={wallet.provider.name}
                          className="w-10 h-10 rounded-lg"
                          onError={(e) => {
                            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzZBNzI4MCIvPgo8cGF0aCBkPSJNMjAgMzBMMTIgMjJIMjhMMjAgMzBaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K';
                          }}
                        />
                        <div className="text-left flex-1">
                          <div className="font-medium">{wallet.provider.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {isConnecting ? 'Connecting...' : 'Ready to connect'}
                          </div>
                        </div>
                        <div className="bg-green-500/10 text-green-600 text-xs px-2 py-1 rounded-full">
                          Installed
                        </div>
                      </div>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </>
          )}

          {/* Show uninstalled wallets */}
          {WALLET_PROVIDERS.filter(p => !installedWallets.includes(p.id)).length > 0 && (
            <>
              <h3 className="text-sm font-medium text-muted-foreground mb-2 mt-4">
                Install a Wallet
              </h3>
              {WALLET_PROVIDERS
                .filter(provider => !installedWallets.includes(provider.id))
                .slice(0, 6) // Show top 6 popular wallets
                .map((provider) => (
                  <Card key={provider.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <CardContent className="p-4">
                      <Button
                        variant="ghost"
                        className="w-full h-auto p-0 justify-start"
                        onClick={() => handleInstallWallet(provider)}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <img 
                            src={provider.icon}
                            alt={provider.name}
                            className="w-10 h-10 rounded-lg opacity-60"
                            onError={(e) => {
                              e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzZBNzI4MCIvPgo8cGF0aCBkPSJNMjAgMzBMMTIgMjJIMjhMMjAgMzBaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K';
                            }}
                          />
                          <div className="text-left flex-1">
                            <div className="font-medium">{provider.name}</div>
                            <div className="text-xs text-muted-foreground">
                              Click to install
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Download size={14} />
                            <ExternalLink size={12} />
                          </div>
                        </div>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </>
          )}

          {availableWallets.length === 0 && (
            <div className="text-center py-8">
              <Wallet className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground mb-4">
                No wallet extensions detected. Install a wallet to get started.
              </p>
              <Button
                onClick={() => handleInstallWallet(WALLET_PROVIDERS[0])}
                className="bg-gradient-to-r from-trustpurple-500 to-trustblue-500"
              >
                <Download className="mr-2" size={16} />
                Install MetaMask
              </Button>
            </div>
          )}
        </div>

        <div className="text-xs text-muted-foreground text-center pt-4 border-t">
          Wallets are browser extensions that let you interact with blockchain networks securely.
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MultiWalletSelector;